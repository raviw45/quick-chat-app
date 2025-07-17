import prisma from "../config/db.config.js";
import catchAsync from "../utils/catchAsync.js";
import { Request, Response } from "express";
export default {
  index: catchAsync(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const chats = await prisma.chats.findMany({
      where: {
        groupId: groupId,
      },
    });
    res.json({ data: chats });
  }),
};
