import { kafka } from '../../kafka.js';

export class KafkaSendMessage {
  public async execute(topic: string, payload: unknown): Promise<void> {
    const producer = kafka.producer({
      allowAutoTopicCreation: true,
    });

    await producer.connect();
    console.log(`\x1b[34m[MESSAGE SEND TO TOPIC: ${topic}]\x1b[34m`);
    console.log(`\x1b[34m[MESSAGE SEND TO PAYLOAD: ${JSON.stringify(payload, null, 2)}]\x1b[34m`);
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
    await producer.disconnect();
  }
}
