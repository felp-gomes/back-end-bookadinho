import jwt from 'jsonwebtoken';
import { prismaClient } from '../../database/prismaUsers';

export class TokenUserCase {
  private key = process.env.JWT_KEY || 'bola';
  constructor() {}

  public createToken(userId: string) {
    try {
      const token = jwt.sign({ userId }, this.key, {
        expiresIn: '2 days',
        algorithm: 'HS256',
      });
      return this.insertToken(token, userId);
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
  public async deleteToken(useId: string) {
    try {
      return await prismaClient.tokens.deleteMany({
        where: {
          user_id: useId,
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

  private handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
