import jwt from 'jsonwebtoken';
import { prismaClient } from '../../infra/database/prisma.js';

export class TokenUsercase {
  private key = process.env.JWT_KEY || 'bola';
  constructor() {}

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
  public async insertToken(token: string, ownerId: string) {
    try {
      await prismaClient.tokens.create({
        data: {
          id: token,
          owner_id: ownerId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteTokens(ownerId: string) {
    try {
      await prismaClient.tokens.deleteMany({
        where: {
          owner_id: ownerId,
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
