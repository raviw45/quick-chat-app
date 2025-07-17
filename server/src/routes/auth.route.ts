import { Router } from "express";
import * as AuthController from "../controller/AuthController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import ChatGroupController from "../controller/ChatGroupController.js";
import ChatGroupUserController from "../controller/ChatGroupUserController.js";
import ChatsController from "../controller/ChatsController.js";

const AuthRouter = Router();

AuthRouter.post("/auth/login", AuthController.login);

// With auth middleware
AuthRouter.get("/chat-group", authMiddleware, ChatGroupController.index);
AuthRouter.get("/chat-group/:id", ChatGroupController.show);
AuthRouter.post("/chat-group", authMiddleware, ChatGroupController.store);
AuthRouter.put("/chat-group/:id", authMiddleware, ChatGroupController.update);
AuthRouter.delete(
  "/chat-group/:id",
  authMiddleware,
  ChatGroupController.destroy
);

AuthRouter.get("/chat-group-user", ChatGroupUserController.index);
AuthRouter.post("/chat-group-user", ChatGroupUserController.store);

AuthRouter.get("/chats/:groupId", ChatsController.index);
export default AuthRouter;
