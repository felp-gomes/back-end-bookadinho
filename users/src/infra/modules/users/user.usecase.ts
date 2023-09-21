import { prismaClient } from '../../database/prismaUsers.js';
import { randomUUID } from 'node:crypto';
import { UserValidation } from '../../dto/users.js';

export class UserUsecase {
  constructor() {}

  public async getAllUsers(allUsers = true) {
    try {
      const getUsers = await prismaClient.users.findMany({
        where: {
          is_activated: allUsers,
        },
        select: {
          id: true,
          user_name: true,
          name: true,
          email: true,
          password: false,
          description: true,
          likes: true,
          latest_readings: true,
          photo: true,
          is_activated: true,
          created_at: true,
          updated_at: true,
        },
      });
      return getUsers;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  public async getUserById(id: string) {
    try {
      const getUserById = await prismaClient.users.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          user_name: true,
          name: true,
          email: true,
          password: false,
          description: true,
          likes: true,
          latest_readings: true,
          photo: true,
          is_activated: true,
          created_at: true,
          updated_at: true,
        },
      });
      return getUserById;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  public async createUser({
    user_name,
    name,
    email,
    password,
    description,
    likes,
    latest_readings,
    photo,
  }: {
    user_name: string;
    name: string;
    email: string;
    password: string;
    description: string | null;
    likes: [] | null;
    latest_readings: [] | null;
    photo: string | null;
  }) {
    try {
      const isUserAlready = await prismaClient.users.findFirst({
        where: {
          OR: [
            {
              user_name: {
                contains: user_name,
              },
            },
            {
              email: {
                contains: email,
              },
            },
          ],
        },
      });
      if (isUserAlready) {
        throw new Error('database-0001', {
          cause: 'Username or email is already in use!',
        });
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }

    try {
      const userValidation = UserValidation.safeParse({
        id: randomUUID(),
        user_name,
        name,
        email,
        password,
        description,
        likes,
        latest_readings,
        photo,
        is_activated: true,
      });

      if (!userValidation.success) {
        throw userValidation.error;
      }

      return await prismaClient.users.create({
        data: {
          ...userValidation.data,
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
