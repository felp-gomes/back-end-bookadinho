import { prismaClient } from '../../infra/database/prisma/prisma.js';

export class UserUsecase {
  constructor() {}

  public async createOwner(ownerId: string) {
    try {
      await prismaClient.owners.create({
        data: {
          id: ownerId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteOwner(ownerId: string) {
    try {
      await prismaClient.owners.delete({
        where: {
          id: ownerId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async getDBOwner(
    where: {
      id?: string;
    },
    select: {
      id?: boolean;
    }
  ) {
    try {
      return await prismaClient.owners.findUnique({
        where: {
          id: where.id,
        },
        select,
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
