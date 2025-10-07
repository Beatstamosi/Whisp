import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import handleError from "../services/handleError.js";

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
  } catch (err) {
    handleError(err, res);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.user?.id } });
    res.status(201).json({ message: "User deleted successfully." });
  } catch (err) {
    handleError(err, res);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    const usersUpdated = users.map((user) => {
      let profilePictureBase64 = null;

      if (user.profile_picture) {
        const base64 = Buffer.from(user.profile_picture).toString("base64");
        profilePictureBase64 = `data:image/png;base64,${base64}`;
      }

      return {
        ...user,
        profile_picture: profilePictureBase64,
      };
    });

    res.status(201).json({ users: usersUpdated });
  } catch (err) {
    handleError(err, res);
  }
};

export { updateUser, deleteUser, getAllUsers };
