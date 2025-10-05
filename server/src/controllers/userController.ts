import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

const updateUser = async (req: Request, res: Response) => {
  try {
    const { bio } = req.body;
    const file = req.file;

    await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        bio,
        profile_picture: file ? file.buffer : undefined,
      },
    });

    res.status(201).json({ message: "User updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error updating user" });
  }
};

export { updateUser };
