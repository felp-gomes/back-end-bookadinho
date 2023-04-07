import express from 'express';
import OAuth from '../models/OAuth';
import ProfileInterface from '../interfaces/profile';
import profiles from '../mocks/profiles';

export default class ProfileController {
  static authenticateProfile(req: express.Request, res: express.Response) {
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
        user_name: profiles[foundProfileIndex].user_name,
      });
      profiles[foundProfileIndex].authorizations.push(tokenByProfile);
      return res.status(202).send({ status: 202, body: { message: 'ok', authorization: tokenByProfile } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error });
    }
  }

  static listProfiles(req: express.Request, res: express.Response) {
    const authorizationProfile = req.headers.authorization as string | undefined;
    if (!authorizationProfile) {
      return res.status(400).send({
        status: 401,
        body: {
          message: 'authorizationProfile is required!',
        },
      });
    }
    try {
      const decryptedToken = OAuth.verifyToken(authorizationProfile) as {
        id: string;
        user_name: string;
      };
      const foundProfileByToken = profiles.find(
        (profile) => profile.id === decryptedToken.id && profile.user_name == decryptedToken.user_name
      );
      if (!foundProfileByToken) {
        return res.status(401).send({
          status: 401,
          body: { message: 'Profile not found!' },
        });
      }
      const { authorizations: tokensProfile }: { authorizations: string[] } = foundProfileByToken;
      const isValidToken = tokensProfile.some((token) => token == authorizationProfile);
      if (!isValidToken) {
        return res.status(401).send({
          status: 401,
          body: {
            message: 'The token is not valid to perform operations!',
          },
        });
      }
      return res.status(200).json({ status: 200, body: { message: 'ok', profiles: profiles } });
    } catch (error) {
      res.status(400).send({ status: 400, body: { message: error } });
    }
  }

  static createProfile(req: express.Request, res: express.Response) {
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
      return res.status(401).send({
        status: 401,
        body: {
          message: 'Username is already in use!',
        },
      });
    }
    if (user_name.length > 20) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'Username is limited to 20 characters!',
        },
      });
    }
    if (name.length > 45) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'Name is limited to 45 characters!',
        },
      });
    }
    if (description.length !== 0 && description.length > 250) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'Description is limited to 250 characters!',
        },
      });
    }
    try {
      const indexProfile: number = profiles.length + 1;
      const tokenByProfile: string = OAuth.createToken({
        id: String(indexProfile),
        user_name: user_name,
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
      return res.status(201).send({ status: 202, body: { message: 'ok', profile: profile } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error });
    }
  }
}