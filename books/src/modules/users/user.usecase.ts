import moment from 'moment';
import { prismaClient } from '../../infra/database/prisma.js';

export class UserUsecase {
  constructor() {}

  public async createOwner({ externalId, user_name }: { externalId: string; user_name: string }) {
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
  public async updateOwner(
    extarnalId: string,
    data: {
      user_name: string;
    }
  ) {
    try {
      const isUserNameAlready = await this.getDBOwner({ user_name: data.user_name }, { id: true });
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
          external_id: extarnalId,
        },
        data,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteOwner(externalId: string) {
    try {
      const userConsulted = await this.getDBOwner({ external_id: externalId }, { id: true });
      if (!userConsulted) throw Error('database-404', { cause: 'Not found user by /external_id/!' });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    try {
      const timeStamp = moment().unix();
      await prismaClient.owners.update({
        where: {
          external_id: externalId,
        },
        data: {
          user_name: `deleteduser@${timeStamp}`,
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
      user_name?: string;
      external_id?: string;
    },
    select: {
      id?: boolean;
      user_name?: boolean;
      external_id?: boolean;
    }
  ) {
    try {
      return await prismaClient.owners.findUnique({
        where: {
          id: where.id,
          user_name: where.user_name,
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
