import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserType, UserValidation } from '../interfaces/user.js';
import profiles from '../mocks/profiles.js';
import authorizations from '../mocks/authorizations.js';
import OAuth from '../models/OAuth.js';
import { validateProfileEmail } from '../utils/utils.js';
import moment from 'moment';
import { randomUUID } from 'node:crypto';

const prismaUsers = new PrismaClient().users;
const prismaAuthorizations = new PrismaClient().authorizations;

export default class ProfileController {
  public static async authenticateProfile(req: Request, res: Response) {
    const { user_name, password }: { user_name: string; password: string } = req.body;
    if (!user_name || !password) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'User name and password profile id are required!',
        },
      });
    }
    const findUser = await prismaUsers.findUnique({
      where: {
        user_name,
        password,
      },
    });
    if (!findUser) {
      return res.status(401).send({
        body: {
          status_code: 401,
          status: 'fail',
          message: 'Incorrect username or password!',
        },
      });
    }
    try {
      const timeUnix = moment().unix();
      const tokenUser: string = OAuth.createToken({
        id: findUser.id,
        timesTamp: timeUnix,
      });
      await prismaAuthorizations.create({
        data: {
          id: tokenUser,
          user_id: findUser.id,
        },
      });
      return res.status(200).send({ body: { status_code: 200, status: 'success', authorization: tokenUser } });
    } catch (error) {
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal error!' } });
    }
  }
  public static async listProfiles(req: Request, res: Response) {
    try {
      const users = await prismaUsers.findMany({
        where: {
          is_activated: true,
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
      return res.status(200).json({ body: { status_cide: 200, status: 'success', profiles: users } });
    } catch (error) {
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal error!' } });
    }
  }
  public static async listProfilebyId(req: Request, res: Response) {
    const { id: userId } = req.params;
    try {
      const userById = await prismaUsers.findUnique({
        where: {
          id: userId,
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
      if (!userById)
        return res.status(404).send({ body: { status_code: 404, status: 'fail', message: 'Not found user by id!' } });
      return res.status(202).send({ body: { status_code: 202, status: 'success', profile: userById } });
    } catch (error) {
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal error!' } });
    }
  }
  public static async createProfile(req: Request, res: Response) {
    const {
      user_name,
      name,
      description = null,
      likes = [],
      latest_readings = [],
      photo = null,
      password,
      email,
    }: UserType = req.body;
    try {
      const isUserAlready = await prismaUsers.findMany({
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
      if (isUserAlready.length > 0)
        return res.status(409).send({
          body: {
            status_code: 409,
            status: 'fail',
            message: 'Username or email is already in use!',
          },
        });
    } catch (error) {
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal error!' } });
    }
    try {
      const validateDataUser = UserValidation.safeParse({
        id: randomUUID(),
        user_name,
        name,
        description,
        likes,
        latest_readings,
        photo,
        password,
        email,
        is_activated: true,
      });
      if (!validateDataUser?.success) {
        throw validateDataUser.error;
      }
      const createdUser: UserType = await prismaUsers.create({
        data: {
          ...validateDataUser.data,
        },
      });
      const timeUnix = moment().unix();
      const tokenUser = OAuth.createToken({
        id: createdUser.id,
        timesTamp: timeUnix,
      });
      await prismaAuthorizations.create({
        data: {
          id: tokenUser,
          user_id: createdUser.id,
        },
      });
      return res
        .status(201)
        .send({ body: { status_code: 201, status: 'success', profile: createdUser, token: tokenUser } });
    } catch (error) {
      if (error.name === 'PrismaClientValidationError') {
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: 'It was not possible to save to the database, check that you are passing all the data correctly!',
          },
        });
      } else if (error.name === 'ZodError') {
        const { errors } = error;
        let messageError = '';
        errors.forEach(
          (error: { path: Array<1>; message: string }) =>
            (messageError += `The parameter /${error.path[0]}/ ${error.message}; `)
        );
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      }
      return res.status(500).send({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'The request could not be completed!',
        },
      });
    }
  }
  public static async editProfile(req: Request, res: Response) {
    const authenticatedUser: UserType = res.locals.foundProfileByToken;
    const {
      user_name,
      name,
      description = null,
      likes = [],
      latest_readings = [],
      photo = null,
      password,
      email,
    }: UserType = req.body;

    try {
      const isUserAlready = await prismaUsers.findFirst({
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
      if (isUserAlready)
        return res.status(409).send({
          body: {
            status_code: 409,
            status: 'fail',
            message: 'Username or email is already in use!',
          },
        });
    } catch (error) {
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal error!' } });
    }

    try {
      const validateDataUser = UserValidation.safeParse({
        id: authenticatedUser.id,
        email: email ?? authenticatedUser.email,
        user_name: user_name ?? authenticatedUser.user_name,
        name: name ?? authenticatedUser.name,
        description: description ?? authenticatedUser.description,
        likes: likes.length === 0 ? authenticatedUser.likes : likes,
        latest_readings: latest_readings.length === 0 ? authenticatedUser.latest_readings : latest_readings,
        photo: photo ?? authenticatedUser.photo,
        password: password ?? authenticatedUser.password,
        is_activated: true,
      });
      if (!validateDataUser.success) {
        throw validateDataUser.error;
      }
      const updatedUser = await prismaUsers.update({
        where: {
          id: authenticatedUser.id,
        },
        data: {
          ...validateDataUser.data,
        },
      });
      if (password) {
        await prismaAuthorizations.deleteMany({
          where: {
            user_id: authenticatedUser.id,
          },
        });
        return res
          .status(202)
          .send({ body: { status_code: 202, status: 'success', message: 'Profile changed successfully!' } });
      }
      return res.status(202).send({ body: { status_code: 202, status: 'success', profile: updatedUser } });
    } catch (error) {
      console.debug('error', JSON.stringify(error, null, 2));
    }
  }
  public static async deleteProfile(req: Request, res: Response) {
    const authenticatedUser: UserType = res.locals.foundProfileByToken;
    const timeUnix = moment().unix();

    await prismaUsers.update({
      where: {
        id: authenticatedUser.id,
      },
      data: {
        user_name: `user_deleted@${timeUnix}`,
        email: `${timeUnix}@bookadinho.com`,
        password: `${timeUnix}`,
      },
    });
    await prismaAuthorizations.deleteMany({
      where: {
        user_id: authenticatedUser.id,
      },
    });
    return res
      .status(200)
      .send({ body: { status_code: 200, status: 'success', message: 'User deleted successfully!' } });
  }
  public static resetPassword(req: Request, res: Response) {
    const foundProfileByToken: UserType = res.locals.foundProfileByToken;
    const { password }: UserType = req.body;
    if (password.length < 6 || password.length > 45) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Password must be between 6 and 45 characters!',
        },
      });
    }
    foundProfileByToken.password = password;
    const foundProfileIndex = profiles.findIndex(({ id }) => id === foundProfileByToken.id);
    for (const authorization in authorizations) {
      if (password && authorizations[authorization] === profiles[foundProfileIndex].id) {
        delete authorizations[authorization];
      }
    }
    profiles[foundProfileIndex] = foundProfileByToken;
    return res
      .status(202)
      .send({ body: { status_code: 202, status: 'success', message: 'Change changed successfully!' } });
  }
}
