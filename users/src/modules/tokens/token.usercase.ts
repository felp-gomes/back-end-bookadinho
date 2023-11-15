import jwt from 'jsonwebtoken';
import { prismaClient } from '../../infra/database/prismaUsers.js';
import { KafkaSendMessage } from '../../infra/kafka/producer/users/user.producer.js';
import { RedisUsecase } from '../../infra/Redis/redis.usecase.js';

export class TokenUsercase extends RedisUsecase {
  private key = process.env.JWT_KEY || 'bola';
  private kafkaMessage = new KafkaSendMessage();
  constructor() {
    super();
  }

  public async createToken(userId: string) {
    try {
      const token = jwt.sign({ userId }, this.key, {
        expiresIn: '2 days',
        algorithm: 'HS256',
      });
      await this.insertToken(userId, token);
      return token;
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
        action: 'delete_many_tokens',
        body: {
          id: useId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteToken(token: string) {
    try {
      await prismaClient.tokens.delete({ where: { id: token } });
      await this.kafkaMessage.execute('tokens', {
        action: 'delete_unique_token',
        body: {
          token: token,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  private async insertToken(userId: string, token: string) {
    try {
      await super.set(`token:${userId}:${token}`, token, 172800);
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
}
