import prisma from "./config/db.config.js";
import { consumer, producer } from "./config/kafka.config.js";

export const produceMessage = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`✅ Produced to topic "${topic}":`, message);
  } catch (error) {
    console.error(`❌ Produce failed for topic "${topic}":`, error);
  }
};

export const consumeMessages = async (topic: string) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawValue = message.value?.toString();
          if (!rawValue) {
            console.warn(`⚠️ Empty message on topic "${topic}"`);
            return;
          }

          const data = JSON.parse(rawValue);
          console.log(`📩 Received from topic "${topic}":`, data);

          await prisma.chats.create({ data });
          console.log("💾 Saved to DB");
        } catch (err) {
          console.error(`❌ Error processing message:`, err);
        }
      },
    });

    console.log(`🟢 Kafka consumer running for topic "${topic}"`);
  } catch (err) {
    console.error("❌ Kafka consumer setup failed:", err);
  }
};
