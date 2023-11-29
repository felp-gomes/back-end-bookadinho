import jwt from 'jsonwebtoken';
import { RedisUsecase } from '../redis/redis.usecase.js';
import { UserUsecase } from '../users/user.usecase.js';

export class TokenUsercase extends RedisUsecase {
  private key = process.env.JWT_KEY || 'bola';
  private userUsecase = new UserUsecase();
  constructor() {
    super();
  }

  public validationToken(token: string) {
    try {
      return jwt.verify(token, this.key);
    } catch (error) {
      super.handleError(error);
      throw error;
    }
  }
  public async verifyToken(token: string) {
    let valueToken: { userId: string; iat: number; exp: number };
    try {
      valueToken = this.validationToken(token) as { userId: string; iat: number; exp: number };
    } catch (error) {
      throw error;
    }
    try {
      const [validTokenByRedis, validUserByDatabase] = await Promise.all([
        await super.getValueKey(`token:${valueToken.userId}:${token}`),
        await this.userUsecase.getDBOwner({ external_id: valueToken.userId }, { id: true }),
      ]);
      if (!validTokenByRedis || !validUserByDatabase) {
        throw new Error('Invalid token for the request!', {
          cause: 'ERR:TOKEN:0001',
        });
      }
      await super.updatedDurationKey(`token:${valueToken.userId}:${token}`, 172800, 'GT');
      return validUserByDatabase.id;
    } catch (error) {
      throw error;
    }
  }
}
