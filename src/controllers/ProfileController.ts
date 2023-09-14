import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserType } from '../interfaces/user.js';
import profiles from '../mocks/profiles.js';
import authorizations from '../mocks/authorizations.js';
import OAuth from '../models/OAuth.js';
import { validateProfileEmail } from '../utils/utils.js';
import moment from 'moment';

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
  public static listProfiles(req: Request, res: Response) {
    const profileList: unknown[] = [];
    for (const profile of profiles) {
      if (!profile.isActive) continue;
      const { password, ...newProfile } = profile;
      profileList.push(newProfile);
    }
    return res.status(200).json({ body: { status_cide: 200, status: 'success', profiles: profileList } });
  }
  public static listProfilebyId(req: Request, res: Response) {
    const idProfile = req.params.id;
    const profileById = profiles.find((profile) => profile.id === idProfile);
    if (!profileById)
      return res.status(404).send({ body: { status_code: 404, status: 'fail', message: 'Not found profile by id!' } });
    const { password, ...profile } = profileById;
    return res.status(202).send({ body: { status_code: 202, status: 'success', book: profile } });
  }
  public static createProfile(req: Request, res: Response) {
    const {
      user_name,
      name,
      description = '',
      likes = [],
      latest_readings = [],
      photo = '',
      password,
      email,
    }: UserType = req.body;
    if (!user_name || !name || !password || !email) {
      return res.status(403).send({
        body: {
          status_code: 401,
          status: 'fail',
          message: 'User name, name, password and email if required!',
        },
      });
    }
    if (profiles.some((profile) => profile.user_name === user_name)) {
      return res.status(409).send({
        body: {
          status_code: 409,
          status: 'fail',
          message: 'Username is already in use!',
        },
      });
    }
    if (profiles.some((profile) => profile.email === email)) {
      return res.status(409).send({
        body: {
          status_code: 409,
          status: 'fail',
          message: 'Email is already in use!',
        },
      });
    }
    if (user_name.length < 4 || user_name.length > 20) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Username must be between 4 and 20 characters!',
        },
      });
    }
    if (name.length < 4 || name.length > 45) {
      return res.status(403).send({
        body: {
          status_coded: 403,
          status: 'fail',
          message: 'Name must be between 4 and 45 characters!',
        },
      });
    }
    if (!validateProfileEmail(email)) {
      return res.status(400).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Not a valid email!',
        },
      });
    }
    if (password.length < 6 || password.length > 45) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Password must be between 6 and 45 characters!',
        },
      });
    }
    if (description.length > 250) {
      return res.status(413).send({
        body: {
          status_code: 413,
          status: 'fail',
          message: 'Description is limited to 250 characters!',
        },
      });
    }
    try {
      const indexProfile: number = profiles.length + 1;
      const tokenProfile: string = OAuth.createToken({
        id: String(indexProfile),
      });
      const profile: UserType = {
        id: String(indexProfile),
        user_name: user_name.trim(),
        name: name.trim(),
        description: description ? description.trim() : null,
        likes: likes.map((like) => like.trim()),
        latest_readings: latest_readings.map((latestReadings) => latestReadings.trim()),
        photo: photo ? photo.trim() : null,
        password: password.trim(),
        email: email.trim(),
        is_activated: true,
      };
      authorizations[tokenProfile] = String(indexProfile);
      profiles.push(profile);
      return res
        .status(201)
        .send({ body: { status_code: 201, status: 'success', profile: profile, token: tokenProfile } });
    } catch (error) {
      return res.status(400).send({ body: { status_code: 400, status: 'fail', message: error } });
    }
  }
  public static editProfile(req: Request, res: Response) {
    const foundProfileByToken: UserType = res.locals.foundProfileByToken;
    const { user_name, name, description, likes, latest_readings, photo, password, email }: UserType = req.body;
    if (user_name !== foundProfileByToken.user_name && profiles.some((profile) => profile.user_name === user_name)) {
      return res.status(409).send({
        body: {
          status_code: 409,
          status: 'fail',
          message: 'Username is already in use!',
        },
      });
    }
    if (user_name && (user_name.length < 4 || user_name.length > 20)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Username must be between 4 and 20 characters!',
        },
      });
    }
    if (name && (name.length < 4 || name.length > 45)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Name must be between 4 and 45 characters!',
        },
      });
    }
    if (email && !validateProfileEmail(email)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Not a valid email!',
        },
      });
    }
    if (password && (password.length < 6 || password.length > 45)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Password must be between 6 and 45 characters!',
        },
      });
    }
    if (description && (description.length < 1 || description.length > 250)) {
      return res.status(413).send({
        body: {
          status_code: 413,
          status: 'fail',
          message: 'Description is limited to 250 characters!',
        },
      });
    }

    const updatedProfile: UserType = {
      ...foundProfileByToken,
      user_name: user_name ? user_name.trim() : foundProfileByToken.user_name,
      name: name ? name.trim() : foundProfileByToken.name,
      description: description ? description.trim() : foundProfileByToken.description,
      likes: likes ? likes.map((like) => like) : foundProfileByToken.likes,
      latest_readings: latest_readings
        ? latest_readings.map((latestReadings) => latestReadings)
        : foundProfileByToken.latest_readings,
      photo: photo ? photo.trim() : foundProfileByToken.photo,
      password: password ? password.trim() : foundProfileByToken.password,
      email: email ? email.trim() : foundProfileByToken.email,
    };
    const foundProfileIndex = profiles.findIndex(({ id }) => id === updatedProfile.id);
    for (const authorization in authorizations) {
      if (password && authorizations[authorization] === updatedProfile.id) {
        delete authorizations[authorization];
      }
    }
    profiles[foundProfileIndex] = updatedProfile;
    if (password) {
      return res
        .status(202)
        .send({ body: { status_code: 202, status: 'success', message: 'Profile changed successfully!' } });
    }
    return res.status(202).send({ body: { status_code: 202, status: 'success', profile: updatedProfile } });
  }
  public static deleteProfile(req: Request, res: Response) {
    const foundProfileByToken: UserType = res.locals.foundProfileByToken;
    foundProfileByToken.user_name = '';
    foundProfileByToken.name = '';
    foundProfileByToken.description = '';
    foundProfileByToken.photo = '';
    foundProfileByToken.password = '';
    foundProfileByToken.email = '';
    foundProfileByToken.isActive = false;
    const foundProfileIndex = profiles.findIndex(({ id }) => id === foundProfileByToken.id);
    for (const authorization in authorizations) {
      if (authorizations[authorization] === profiles[foundProfileIndex].id) {
        delete authorizations[authorization];
      }
    }
    profiles[foundProfileIndex] = foundProfileByToken;
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
