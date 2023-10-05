import { kafkaConsumer } from './kafka.consumer.js';
import { UserUsecase } from '../../../../modules/users/user.usecase.js';
import { TokenUsercase } from '../../../../modules/tokens/token.usercase.js';

type TokenConsumer = {
  action: string;
  body: {
    id: string;
    token: string;
  };
};

export async function tokenKafkaConsumer() {
  const tokenUsecase = new TokenUsercase();
  const userUsecase = new UserUsecase();
  const consumer = await kafkaConsumer('tokens');
  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const tokenConsumer: TokenConsumer = JSON.parse(messageToString);
      console.log('\x1b[tokenConsumer]\x1b[0m');
      console.log(tokenConsumer);
      console.log('\x1b[tokenConsumer]\x1b[0m');
      switch (tokenConsumer.action) {
        case 'create': {
          const userConsulted = await userUsecase.getDBOwner({ external_id: tokenConsumer.body.id }, { id: true });
          if (!userConsulted) {
            console.debug('\x1b[34m[USER NOT FOUND IN DATABASE]\x1b[0m');
            break;
          }
          await tokenUsecase.insertToken(tokenConsumer.body.token, userConsulted.id);
          break;
        }
        case 'delete': {
          const userConsulted = await userUsecase.getDBOwner({ id: tokenConsumer.body.id }, { id: true });
          if (!userConsulted) {
            console.debug('\x1b[34m[USER NOT FOUND IN DATABASE]\x1b[0m');
            break;
          }
          await tokenUsecase.deleteTokens(userConsulted.id);
          break;
        }
      }
    },
  });
}

tokenKafkaConsumer();
