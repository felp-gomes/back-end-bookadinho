import { kafka } from '../../kafka.js';

export class KafkaSendMessage {
  public async execute(topic: string, payload: unknown): Promise<void> {
    const producer = kafka.producer({
      allowAutoTopicCreation: true,
    });
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
    await producer.disconnect();
  }
}
