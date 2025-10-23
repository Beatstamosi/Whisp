import prisma from "../lib/prisma.js";
import handleError from "../services/handleError.js";
import { getIO } from "../socket.js";
const getAllChats = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return;
    try {
        const chats = await prisma.chats.findMany({
            where: {
                participants: {
                    some: { userId },
                },
                OR: [
                    {
                        is_group: true, // allow empty messages if group
                    },
                    {
                        AND: [
                            { is_group: false },
                            { messages: { some: {} } }, // only include 1:1 chats that have messages
                        ],
                    },
                ],
            },
            include: {
                participants: {
                    include: { user: true },
                },
                messages: {
                    orderBy: { sent_at: "desc" },
                    take: 1,
                    include: {
                        messageRead: {
                            where: { userId },
                        },
                    },
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                messageRead: { none: { userId } },
                            },
                        },
                    },
                },
            },
        });
        if (!chats)
            return res.status(404).json({ message: "Chats not found" });
        const chatUpdated = chats.map((chat) => {
            return {
                ...chat,
                participants: chat.participants.map((p) => {
                    let base64ProfilePicture = null;
                    if (p.user.profile_picture) {
                        const base64 = Buffer.from(p.user.profile_picture).toString("base64");
                        base64ProfilePicture = `data:image/png;base64,${base64}`;
                    }
                    return {
                        ...p,
                        user: {
                            ...p.user,
                            profile_picture: base64ProfilePicture,
                        },
                    };
                }),
            };
        });
        res.status(201).json({ chats: chatUpdated });
    }
    catch (err) {
        handleError(err, res);
    }
};
const openChatWithUser = async (req, res) => {
    const { recipientId } = req.params;
    const openChatUserId = req.user?.id;
    try {
        if (!openChatUserId || !recipientId)
            throw Error("Missing recipients");
        let existingChat;
        if (recipientId === openChatUserId) {
            // Self-chat: must have exactly one participant
            existingChat = await prisma.chats.findFirst({
                where: {
                    is_group: false,
                    participants: {
                        every: { userId: openChatUserId },
                    },
                },
                select: {
                    id: true,
                },
            });
        }
        else {
            // Normal 1-on-1 chat
            existingChat = await prisma.chats.findFirst({
                where: {
                    is_group: false,
                    AND: [
                        { participants: { some: { userId: openChatUserId } } },
                        { participants: { some: { userId: recipientId } } },
                    ],
                },
                select: {
                    id: true,
                },
            });
        }
        if (existingChat) {
            res.status(201).json({ chatId: existingChat.id });
        }
        else {
            const participantData = recipientId === openChatUserId
                ? [{ userId: recipientId }]
                : [{ userId: openChatUserId }, { userId: recipientId }];
            const newChat = await prisma.chats.create({
                data: {
                    is_group: false,
                    name: null,
                    participants: {
                        create: participantData,
                    },
                },
                select: {
                    id: true,
                },
            });
            res.status(201).json({ chatId: newChat.id });
        }
    }
    catch (err) {
        handleError(err, res);
    }
};
const getSingleChat = async (req, res) => {
    const { chatId } = req.params;
    if (!chatId)
        return;
    try {
        const chat = await prisma.chats.findUnique({
            where: { id: chatId },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                profile_picture: true,
                                last_seen_at: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: { sent_at: "asc" },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                            },
                        },
                        messageRead: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstname: true,
                                        lastname: true,
                                    },
                                },
                            },
                        },
                        messageAttachments: true,
                    },
                },
            },
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found" });
        // Convert profile pictures and files to base64 for all participants
        const chatUpdated = {
            ...chat,
            participants: chat.participants.map((p) => {
                let base64ProfilePicture = null;
                if (p.user.profile_picture) {
                    const base64 = Buffer.from(p.user.profile_picture).toString("base64");
                    base64ProfilePicture = `data:image/png;base64,${base64}`;
                }
                return {
                    ...p,
                    user: {
                        ...p.user,
                        profile_picture: base64ProfilePicture,
                    },
                };
            }),
            messages: chat.messages.map((m) => ({
                ...m,
                messageAttachments: m.messageAttachments.map((a) => ({
                    ...a,
                    // convert binary to base64 string
                    file_data: a.file_data
                        ? Buffer.from(a.file_data).toString("base64")
                        : null,
                })),
            })),
        };
        res.status(200).json({ chat: chatUpdated });
    }
    catch (err) {
        handleError(err, res);
    }
};
const addMessage = async (req, res) => {
    const { chatId } = req.params;
    const senderId = req.user?.id;
    const content = req.body.content;
    const file = req.file;
    const io = getIO();
    if (!chatId || !content || !senderId)
        throw new Error("Missing chatId or content");
    try {
        const chat = await prisma.chats.update({
            where: { id: chatId },
            data: {
                messages: {
                    create: {
                        senderId: senderId,
                        content,
                        messageRead: {
                            create: {
                                userId: senderId,
                            },
                        },
                        messageAttachments: file
                            ? {
                                create: {
                                    file_name: file.originalname,
                                    file_type: file.mimetype,
                                    file_data: file.buffer,
                                },
                            }
                            : undefined,
                    },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                profile_picture: true,
                                last_seen_at: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: { sent_at: "asc" },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                            },
                        },
                        messageRead: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstname: true,
                                        lastname: true,
                                    },
                                },
                            },
                        },
                        messageAttachments: true,
                    },
                },
            },
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found" });
        // Convert profile pictures and files to base64 for all participants
        const chatUpdated = {
            ...chat,
            participants: chat.participants.map((p) => {
                let base64ProfilePicture = null;
                if (p.user.profile_picture) {
                    const base64 = Buffer.from(p.user.profile_picture).toString("base64");
                    base64ProfilePicture = `data:image/png;base64,${base64}`;
                }
                return {
                    ...p,
                    user: {
                        ...p.user,
                        profile_picture: base64ProfilePicture,
                    },
                };
            }),
            messages: chat.messages.map((m) => ({
                ...m,
                messageAttachments: m.messageAttachments.map((a) => ({
                    ...a,
                    // convert binary to base64 string
                    file_data: a.file_data
                        ? Buffer.from(a.file_data).toString("base64")
                        : null,
                })),
            })),
        };
        // broadcast updated chat to chat page
        io.to(chatId).emit("chat:message", chatUpdated);
        // broadcast updatec chat to chat list of recipient(s)
        const recipients = chatUpdated.participants.filter((p) => p.userId !== senderId);
        recipients.forEach((rec) => {
            io.to(rec.userId).emit("chatList:update", "Marked as read");
        });
        res.sendStatus(201);
    }
    catch (err) {
        handleError(err, res);
    }
};
const createGroupChat = async (req, res) => {
    const { name, participants } = req.body;
    try {
        if (!name || !participants)
            throw Error("Missing name / participants");
        const participantsFormatted = participants.map((p) => ({
            userId: p,
        }));
        const chat = await prisma.chats.create({
            data: {
                is_group: true,
                name: name,
                participants: {
                    createMany: {
                        data: participantsFormatted,
                    },
                },
            },
        });
        res.status(201).json({ chatId: chat.id });
    }
    catch (err) {
        handleError(err, res);
    }
};
const getParticipants = async (req, res) => {
    const { chatId } = req.params;
    try {
        if (!chatId)
            throw Error("Missing chatId from params");
        const participants = await prisma.chatParticipants.findMany({
            where: {
                chatId: chatId,
            },
            include: {
                user: true,
            },
        });
        // Convert profile pictures to base64 for all participants
        const participantsUpdated = participants.map((p) => {
            let base64ProfilePicture = null;
            if (p.user.profile_picture) {
                const base64 = Buffer.from(p.user.profile_picture).toString("base64");
                base64ProfilePicture = `data:image/png;base64,${base64}`;
            }
            return {
                ...p,
                user: {
                    ...p.user,
                    profile_picture: base64ProfilePicture,
                },
            };
        });
        res.status(201).json({ participants: participantsUpdated });
    }
    catch (err) {
        handleError(err, res);
    }
};
export { getAllChats, openChatWithUser, getSingleChat, addMessage, createGroupChat, getParticipants, };
