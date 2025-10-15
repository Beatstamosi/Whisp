import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import handleError from "../services/handleError.js";

const getAllChats = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return;

  try {
    const chats = await prisma.chats.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: true,
      },
    });

    if (!chats) return res.status(404).json({ message: "Chats not found" });

    const chatUpdated = chats.map((chat) => {
      return {
        ...chat,
        participants: chat.participants.map((p) => {
          let base64ProfilePicture = null;
          if (p.user.profile_picture) {
            const base64 = Buffer.from(p.user.profile_picture).toString(
              "base64"
            );
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
  } catch (err) {
    handleError(err, res);
  }
};

const openChatWithUser = async (req: Request, res: Response) => {
  const { recipientId } = req.params;
  const openChatUserId = req.user?.id;

  if (!openChatUserId) return;

  try {
    const existingChat = await prisma.chats.findFirst({
      where: {
        is_group: false,
        participants: {
          every: {
            OR: [{ userId: recipientId }, { userId: openChatUserId }],
          },
        },
      },
      include: { participants: true },
    });

    if (existingChat) {
      res.status(201).json({ chatId: existingChat.id });
    } else {
      const newChat = await prisma.chats.create({
        data: {
          is_group: false,
          name: null,
          participants: {
            create:
              recipientId !== openChatUserId
                ? [{ userId: recipientId }, { userId: openChatUserId }]
                : [{ userId: recipientId }],
          },
        },
      });
      res.status(201).json({ chatId: newChat.id });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const getSingleChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  if (!chatId) return;

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

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Convert profile pictures to base64 for all participants
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
    };

    res.status(200).json({ chat: chatUpdated });
  } catch (err) {
    handleError(err, res);
  }
};

const addMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const senderId = req.user?.id;
  const content = req.body.content;

  if (!chatId || !content || !senderId)
    throw new Error("Missing chatId or content");

  try {
    await prisma.chats.update({
      where: { id: chatId },
      data: {
        messages: {
          create: {
            senderId: senderId,
            content,
          },
        },
      },
    });

    res.sendStatus(201);
  } catch (err) {
    handleError(err, res);
  }
};

const createGroupChat = async (req: Request, res: Response) => {
  const { name, participants } = req.body;

  try {
    if (!name || !participants) throw Error("Missing name / participants");

    const participantsFormatted = participants.map((p: string) => ({
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
  } catch (err) {
    handleError(err, res);
  }
};

export {
  getAllChats,
  openChatWithUser,
  getSingleChat,
  addMessage,
  createGroupChat,
};
