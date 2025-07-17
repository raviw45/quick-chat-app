import prisma from "../config/db.config.js";
import catchAsync from "../utils/catchAsync.js";
import { Request, Response } from "express";
interface GroupUserType {
  name: string;
  groupId: string;
}

export default {
  index: catchAsync(async (req: Request, res: Response) => {
    const { groupId } = req.query;

    const users = await prisma.groupUsers.findMany({
      where: {
        groupId: groupId as string,
      },
    });

    res.json({ message: "Date fetched successfully!", data: users });
  }),

  store: catchAsync(async (req: Request, res: Response) => {
    const body: GroupUserType = req.body;
    const user = await prisma.groupUsers.create({ data: body });
    res.json({ message: "User created successfully!", data: user });
  }),
};
