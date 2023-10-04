import { kafkaConsumer } from '../kafka.consumer.js';
import { UserUsecase } from '../../../../modules/users/user.usecase.js';

type UserConsumer = {
  action: string;
  body: {
    id: string;
    user_name: string;
  };
};

export async function userKafkaConsumer() {
  const userUsecase = new UserUsecase();
  const consumer = await kafkaConsumer('users');
  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const userConsumer: UserConsumer = JSON.parse(messageToString);
      switch (userConsumer.action) {
        case 'create':
          await userUsecase.createUser({ externalId: userConsumer.body.id, user_name: userConsumer.body.user_name });
          break;
        case 'update':
          await userUsecase.updateUse(userConsumer.body.id, { user_name: userConsumer.body.user_name });
          break;

        // INSERT MORE ACTION (DELETE)
        default:
          // EXCEPTION
          break;
      }
    },
  });
}

userKafkaConsumer();
