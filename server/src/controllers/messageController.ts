import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import handleError from "../services/handleError.js";
import { getIO } from "../socket.js";

const markMessageAsRead = async (req: Request, res: Response) => {
  const { messageId, userId } = req.params;
  const io = getIO();

  try {
    if (!messageId) throw Error("Missing message Id");

    await prisma.messages.update({
      where: { id: messageId },
      data: {
        messageRead: {
          connectOrCreate: {
            where: {
              messageId_userId: { messageId, userId },
            },
            create: { userId },
          },
        },
      },
    });

    io.to(userId).emit("chatList:update", "Marked as read");

    res.sendStatus(201);
  } catch (err) {
    handleError(err, res);
  }
};

export { markMessageAsRead };
