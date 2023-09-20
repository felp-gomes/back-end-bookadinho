import { prismaClient } from '../../database/prismaUsers.js';

export class UserUsecase {
  constructor() {}

  public async getAllUsers(onlyActivated = true) {
    console.log('chegou até getAllUsers module');
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
    } catch (error) {
      console.log(error);
    }
  }
}
