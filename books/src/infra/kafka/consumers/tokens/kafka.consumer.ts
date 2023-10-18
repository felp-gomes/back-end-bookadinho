import { kafka } from '../../kafka.js';

export const kafkaConsumer = async (topic: string) => {
  const consumer = kafka.consumer({ groupId: 'TOKENS_APP' });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  return consumer;
};
