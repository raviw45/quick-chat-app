import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./routes/auth.route.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { setupSocket } from "./socket.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.js";
import { instrument } from "@socket.io/admin-ui";
import {
  connectKafkaProducer,
  createKafkaTopic,
} from "./config/kafka.config.js";
import { consumeMessages } from "./helper.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:3000"],
    credentials: true,
  },
  adapter: createAdapter(redis),
});

instrument(io, { auth: false, mode: "development" });
setupSocket(io);

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", AuthRouter);

const startServer = async () => {
  try {
    const topic = process.env.KAFKA_TOPIC!;
    await createKafkaTopic(topic);
    await connectKafkaProducer();
    await consumeMessages(topic);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting application:", err);
  }
};

startServer();
