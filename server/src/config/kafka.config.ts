import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";

// Always include all Aiven brokers listed in connection info
const kafka = new Kafka({
  clientId: "quickchat-app-client",
  brokers: [
    "quickchatapp-workravikant45-758e.d.aivencloud.com:18872",
    "quickchatapp-workravikant45-758e.d.aivencloud.com:18863",
    "quickchatapp-workravikant45-758e.d.aivencloud.com:18861",
    "quickchatapp-workravikant45-758e.d.aivencloud.com:18882",
  ],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "chat-group",
});

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};

export const createKafkaTopic = async (topic: string) => {
  const admin = kafka.admin();
  await admin.connect();

  const topics = await admin.listTopics();

  if (!topics.includes(topic)) {
    await admin.createTopics({
      topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
    });
    console.log(`🟢 Created Kafka topic: ${topic}`);
  } else {
    console.log(`ℹ️ Kafka topic already exists: ${topic}`);
  }

  await admin.disconnect();
};
