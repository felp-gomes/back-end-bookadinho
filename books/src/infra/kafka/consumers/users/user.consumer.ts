import { kafkaConsumer } from './kafka.consumer.js';
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
          try {
            await userUsecase.createOwner({ externalId: userConsumer.body.id, user_name: userConsumer.body.user_name });
          } catch (error) {
            console.debug('\x1b[31m[ERROR CREATEOWNER]\x1b[31m');
          }
          break;
        case 'update':
          try {
            await userUsecase.updateOwner(userConsumer.body.id, { user_name: userConsumer.body.user_name });
          } catch (error) {
            console.debug('\x1b[31m[ERROR UPDATEOWNER]\x1b[31m', error);
          }
          break;
        case 'delete':
          try {
            await userUsecase.deleteOwner(userConsumer.body.id);
          } catch (error) {
            console.debug('\x1b[31m[ERROR DELETEOWNER]\x1b[31m', error);
          }
          break;
        default:
          console.debug('\x1b[31m[RECEIVED MESSAGE AND NOT FOUND ACTION]\x1b[0m');
      }
    },
  });
}

userKafkaConsumer();
