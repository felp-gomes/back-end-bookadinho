import { prismaClient } from '../../database/prismaUsers.js';

export class UserUsecase {
  constructor() {}

  public async getAllUsers(onlyActivated = true) {
    try {
      const getUsers = await prismaClient.users.findMany({
        where: {
          is_activated: onlyActivated,
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

  private handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
