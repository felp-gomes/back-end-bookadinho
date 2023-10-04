import { prismaClient } from '../../infra/database/prisma.js';

export class UserUsecase {
  constructor() {}

  public async createUser({ externalId, user_name }: { externalId: string; user_name: string }) {
    try {
      const isUserAlready = await prismaClient.owners.findFirst({
        where: {
          OR: [
            {
              external_id: {
                contains: externalId,
              },
            },
            {
              user_name: {
                contains: user_name,
              },
            },
          ],
        },
      });
      if (isUserAlready) {
        throw new Error('database-0001', {
          cause: '/user_name/ or /extarnal_id/ is already in use!',
        });
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    try {
      await prismaClient.owners.create({
        data: {
          external_id: externalId,
          user_name,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async updateUse(
    userId: string,
    data: {
      user_name: string;
    }
  ) {
    try {
      const isUserNameAlready = await prismaClient.owners.findUnique({
        where: {
          ...data,
        },
      });
      if (isUserNameAlready) {
        throw new Error('database-0001', {
          cause: '/user_name/ is already in use!',
        });
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    try {
      await prismaClient.owners.update({
        where: {
          external_id: userId,
        },
        data,
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
