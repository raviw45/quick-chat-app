import { Server, Socket } from "socket.io";
import { produceMessage } from "./helper.js";

interface CustomSocket extends Socket {
  room?: string;
}

export function setupSocket(io: Server) {
  // Middleware for room validation
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;

    if (!room || typeof room !== "string") {
      return next(new Error("❌ Invalid Room: Please pass a valid room ID"));
    }

    socket.room = room.trim();
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    if (!socket.room) {
      console.warn(`⚠️ Socket ${socket.id} connected without a room`);
      return;
    }

    console.log(`🔌 Socket connected: ${socket.id} joined room ${socket.room}`);
    socket.join(socket.room);

    socket.on("message", async (data: any) => {
      try {
        console.log(`📩 Message received from ${socket.id}:`, data);
        await produceMessage(process.env.KAFKA_TOPIC!, data);
        socket.to(socket.room!).emit("message", data);
      } catch (err) {
        console.error("❌ Error handling message event:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❎ User disconnected: ${socket.id}`);
    });
  });
}
