import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync.js";
import prisma from "../config/db.config.js";

export default {
  index: catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const groups = await prisma.chatGroup.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ data: groups });
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id) {
      const group = await prisma.chatGroup.findUnique({
        where: {
          id: id,
        },
      });

      res.status(200).json({ data: group });
    }
    res.status(404).json({ message: "No Groups found with this ID" });
  }),

  store: catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    const user = req.user;
    await prisma.chatGroup.create({
      data: {
        title: body?.title,
        passcode: body?.passcode,
        userId: user?.id,
      },
    });

    res.status(201).json({ message: "Chat Group created successfully" });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    if (id) {
      await prisma.chatGroup.update({
        where: {
          id: id,
        },
        data: {
          title: body?.title,
          passcode: body?.passcode,
        },
      });
      res.status(200).json({ message: "Chat Group updated successfully" });
    } else {
      res.status(404).json({ message: "No Groups found with this ID" });
    }
  }),

  destroy: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id) {
      await prisma.chatGroup.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({ message: "Chat Group deleted successfully" });
    } else {
      res.status(404).json({ message: "No Groups found with this ID" });
    }
  }),
};
