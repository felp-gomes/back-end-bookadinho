import { prismaClient } from '../../infra/database/prisma/prisma.js';

export class UserUsecase {
  constructor() {}

  public async createUser({ externalId }: { externalId: string }) {
    try {
      const isUserAlready = await prismaClient.users.findFirst({
        where: {
          external_id: externalId,
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
      await prismaClient.users.create({
        data: {
          external_id: externalId,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async getDBUser(
    where: {
      id?: string;
      external_id?: string;
    },
    select: {
      id?: boolean;
      external_id?: boolean;
    }
  ) {
    try {
      return await prismaClient.users.findUnique({
        where: {
          id: where.id,
          external_id: where.external_id,
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
