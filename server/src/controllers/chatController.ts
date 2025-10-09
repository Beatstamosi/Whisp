import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import handleError from "../services/handleError.js";
import type { Chats } from "@prisma/client";

const getAllChats = async (req: Request, res: Response) => {
  const chats: Chats[] = [
    {
      id: "1",
      name: "Chat 1",
      created_at: new Date(),
      is_group: false,
    },
    {
      id: "2",
      name: "Chat 2",
      created_at: new Date(),
      is_group: false,
    },
  ];

  try {
    res.status(201).json({ chats });
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
            create: [{ userId: recipientId }, { userId: openChatUserId }],
          },
        },
      });
      res.status(201).json({ chatId: newChat.id });
    }
  } catch (err) {
    handleError(err, res);
  }
};

export { getAllChats, openChatWithUser };
