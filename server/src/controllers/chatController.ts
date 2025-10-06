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

export { getAllChats };
