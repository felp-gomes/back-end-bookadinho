import { Request, Response, NextFunction } from 'express';
import OAuth from '../models/OAuth';
import profiles from '../mocks/profiles';
import ProfileInterface from '../interfaces/profile';

export default class Authenticated {
  public static verifyAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authorizationProfile: string | undefined = req.headers.authorization;
    if (!authorizationProfile) {
      return res.status(401).send({
        status: 401,
        body: {
          message: 'authorizationProfile is required!',
        },
      });
    }
    try {
      const decryptedToken = OAuth.verifyToken(authorizationProfile) as {
        id: string;
      };
      const foundProfileByToken: ProfileInterface | undefined = profiles.find(
        (profile) => profile.id === decryptedToken.id
      );
      if (!foundProfileByToken) {
        return res.status(401).send({
          status: 401,
          body: { message: 'Profile not found!' },
        });
      }
      const { authorizations: tokensProfile }: { authorizations: string[] } = foundProfileByToken;
      const isValidToken = tokensProfile.some((token) => token === authorizationProfile);
      if (!isValidToken) {
        return res.status(401).send({
          status: 401,
          body: {
            message: 'The token is not valid to perform operations!',
          },
        });
      }
      res.locals.foundProfileByToken = foundProfileByToken;
      next();
    } catch (error) {
      return res.status(400).send({
        status: 400,
        body: { message: error },
      });
    }
  }
}
