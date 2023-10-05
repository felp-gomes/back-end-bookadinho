import jwt from 'jsonwebtoken';
import { prismaClient } from '../../infra/database/prismaUsers.js';
import { KafkaSendMessage } from '../../infra/kafka/producer/users/user.producer.js';

export class TokenUserCase {
  private key = process.env.JWT_KEY || 'bola';
  private kafkaMessage = new KafkaSendMessage();
  constructor() {}

  public async createToken(userId: string) {
    try {
      const token = jwt.sign({ userId }, this.key, {
        expiresIn: '2 days',
        algorithm: 'HS256',
      });
      const tokenCreated = await this.insertToken(token, userId);
      await this.kafkaMessage.execute('tokens', {
        action: 'create',
        body: {
          id: tokenCreated.user_id,
          token: tokenCreated.id,
        },
      });
      return tokenCreated;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public verifyToken(token: string) {
    try {
      return jwt.verify(token, this.key);
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async getToken(token: string) {
    return await prismaClient.tokens.findUnique({
      where: {
        id: token,
      },
    });
  }
  public async deleteTokens(useId: string) {
    try {
      await prismaClient.tokens.deleteMany({
        where: {
          user_id: useId,
        },
      });
      await this.kafkaMessage.execute('tokens', {
        action: 'delete',
        body: {
          id: useId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  private async insertToken(id: string, userId: string) {
    try {
      return await prismaClient.tokens.create({
        data: {
          id,
          user_id: userId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  private async updatedToken(token: string, newToken: string) {
    await prismaClient.tokens.update({
      where: {
        id: token,
      },
      data: {
        id: newToken,
      },
    });
  }
  private handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
