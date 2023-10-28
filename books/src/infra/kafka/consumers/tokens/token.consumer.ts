import { kafkaConsumer } from './kafka.consumer.js';
import { UserUsecase } from '../../../../modules/users/user.usecase.js';
import { TokenUsercase } from '../../../../modules/tokens/token.usercase.js';

export async function tokenKafkaConsumer() {
  const tokenUsecase = new TokenUsercase();
  const userUsecase = new UserUsecase();
  const consumer = await kafkaConsumer('tokens');
  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const tokenConsumer = JSON.parse(messageToString);
      switch (tokenConsumer.action) {
        case 'create_token': {
          try {
            const userConsulted = await userUsecase.getDBOwner({ external_id: tokenConsumer.body.id }, { id: true });
            if (!userConsulted) {
              console.debug('\x1b[34m[USER NOT FOUND IN DATABASE]\x1b[0m');
              break;
            }
            await tokenUsecase.insertToken(tokenConsumer.body.token, userConsulted.id);
          } catch (error) {
            console.debug('\x1b[31m[ERROR CREATE TOKEN]\x1b[31m');
          }
          break;
        }
        case 'delete_many_tokens': {
          try {
            const userConsulted = await userUsecase.getDBOwner({ id: tokenConsumer.body.id }, { id: true });
            if (!userConsulted) {
              console.debug('\x1b[34m[USER NOT FOUND IN DATABASE]\x1b[0m');
              break;
            }
            await tokenUsecase.deleteTokens(userConsulted.id);
          } catch (error) {
            console.debug('\x1b[31m[ERROR DELETE TOKENS]\x1b[31m');
          }
          break;
        }
        case 'delete_unique_token': {
          try {
            await tokenUsecase.deleteToken(tokenConsumer.body.token);
          } catch (error) {
            console.debug('\x1b[34m[USER NOT FOUND IN DATABASE]\x1b[0m');
          }
          break;
        }
      }
    },
  });
}

tokenKafkaConsumer();
