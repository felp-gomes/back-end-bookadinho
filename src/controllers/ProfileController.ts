import { Request, Response } from 'express';
import OAuth from '../models/OAuth';
import ProfileInterface from '../interfaces/profile';
import profiles from '../mocks/profiles';

export default class ProfileController {
  public static authenticateProfile(req: Request, res: Response) {
    const { user_name, password }: { user_name: string; password: string } = req.body;
    if (!user_name || !password) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'User name and password profile id are required!',
        },
      });
    }
    const foundProfileIndex = profiles.findIndex(
      (profile) => profile.user_name === user_name && profile.password === password
    );
    if (foundProfileIndex === -1) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'Incorrect username or password!',
        },
      });
    }
    try {
      const tokenByProfile: string = OAuth.createToken({
        id: profiles[foundProfileIndex].id,
      });
      profiles[foundProfileIndex].authorizations.push(tokenByProfile);
      return res.status(202).send({ status: 202, body: { message: 'ok', authorization: tokenByProfile } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error });
    }
  }
  public static listProfiles(req: Request, res: Response) {
    return res.status(200).json({ status: 200, body: { message: 'ok', profiles: profiles } });
  }
  public static createProfile(req: Request, res: Response) {
    const {
      user_name,
      name,
      description = '',
      likes = [],
      change_books = [],
      latest_readings = [],
      photo = '',
      password,
    }: {
      user_name: string;
      name: string;
      description: string;
      likes: string[];
      change_books: {
        id: string;
        name: string;
        photo: string;
      }[];
      latest_readings: string[];
      photo: string;
      password: string;
    } = req.body;
    if (!user_name || !name || !password) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'User name, name and password if required!',
        },
      });
    }
    if (profiles.some((profile) => profile.user_name == user_name)) {
      return res.status(409).send({
        status: 409,
        body: {
          message: 'Username is already in use!',
        },
      });
    }
    if (user_name.length < 4 || user_name.length > 20) {
      return res.status(400).send({
        status: 400,
        body: {
          message: 'Username must be between 4 and 20 characters!',
        },
      });
    }
    if (name.length < 4 || name.length > 45) {
      return res.status(400).send({
        status: 400,
        body: {
          message: 'Name must be between 4 and 45 characters!',
        },
      });
    }
    if (password.length < 6 || password.length > 45) {
      return res.status(400).send({
        status: 400,
        body: {
          message: 'Password must be between 6 and 45 characters!',
        },
      });
    }
    if (description.length > 250) {
      return res.status(413).send({
        status: 413,
        body: {
          message: 'Description is limited to 250 characters!',
        },
      });
    }
    try {
      const indexProfile: number = profiles.length + 1;
      const tokenByProfile: string = OAuth.createToken({
        id: String(indexProfile),
      });
      const profile: ProfileInterface = {
        id: String(indexProfile),
        user_name,
        name,
        description,
        likes,
        change_books,
        latest_readings,
        photo,
        password,
        authorizations: [tokenByProfile],
      };
      profiles.push(profile);
      return res.status(201).send({ status: 201, body: { message: 'ok', profile: profile } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error });
    }
  }

  public static editProfile(req: Request, res: Response) {
    console.log(req.body);
    const {
      foundProfileByToken,
      user_name,
      name,
      description,
      likes,
      change_books,
      latest_readings,
      photo,
      password,
    }: {
      foundProfileByToken: ProfileInterface;
      user_name: string;
      name: string;
      description: string;
      likes: string[];
      change_books: {
        id: string;
        name: string;
        photo: string;
      }[];
      latest_readings: string[];
      photo: string;
      password: string;
    } = req.body;
    if (user_name !== foundProfileByToken.user_name && profiles.some((profile) => profile.user_name == user_name)) {
      return res.status(409).send({
        status: 409,
        body: {
          message: 'Username is already in use!',
        },
      });
    }
    if (user_name && (user_name.length < 4 || user_name.length > 20)) {
      return res.status(400).send({
        status: 400,
        body: {
          message: 'Username must be between 4 and 20 characters!',
        },
      });
    }
    if (name && (name.length < 4 || name.length > 45)) {
      return res.status(400).send({
        status: 400,
        body: {
          message: 'Name must be between 4 and 45 characters!',
        },
      });
    }
    if (password && (password.length < 6 || password.length > 45)) {
      return res.status(400).send({
        status: 400,
        body: {
          message: 'Password must be between 6 and 45 characters!',
        },
      });
    }
    if (description && description.length > 250) {
      return res.status(413).send({
        status: 413,
        body: {
          message: 'Description is limited to 250 characters!',
        },
      });
    }

    const updatedProfile: ProfileInterface = {
      ...foundProfileByToken,
      user_name: user_name ?? foundProfileByToken.user_name,
      name: name ?? foundProfileByToken.name,
      description: description ?? foundProfileByToken.description,
      likes: likes ?? foundProfileByToken.likes,
      change_books: change_books ?? foundProfileByToken.change_books,
      latest_readings: latest_readings ?? foundProfileByToken.latest_readings,
      photo: photo ?? foundProfileByToken.photo,
      password: password ?? foundProfileByToken.password,
    };

    const foundProfileIndex = profiles.findIndex(({ id }) => {
      id === updatedProfile.id;
    });
    profiles[foundProfileIndex] = updatedProfile;

    return res.status(202).send({ status: 202, body: { message: 'ok', profile: updatedProfile } });
  }
}
