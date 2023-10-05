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
          await userUsecase.createOwner({ externalId: userConsumer.body.id, user_name: userConsumer.body.user_name });
          break;
        case 'update':
          await userUsecase.updateOwner(userConsumer.body.id, { user_name: userConsumer.body.user_name });
          break;
        case 'delete':
          await userUsecase.deleteOwner(userConsumer.body.id);
          break;
        default:
          console.debug('\x1b[31m[RECEIVED MESSAGE AND NOT FOUND ACTION]\x1b[0m');
      }
    },
  });
}

userKafkaConsumer();
