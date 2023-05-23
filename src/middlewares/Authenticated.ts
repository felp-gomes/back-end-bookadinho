import { Request, Response, NextFunction } from 'express';
import OAuth from '../models/OAuth';
import profiles from '../mocks/profiles';
import authorizations from '../mocks/authorizations';
import { ProfileInterface } from '../interfaces/profile';

export default class Authenticated {
  public static verifyAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authorizationProfile = req.headers.authorization;
    if (!authorizationProfile) {
      return res.status(401).send({
        body: {
          status_code: 401,
          status: 'fail',
          message: 'AuthorizationProfile is required!',
        },
      });
    }
    try {
      const decryptedToken = OAuth.verifyToken(authorizationProfile) as {
        id: string;
      };
      if(authorizations[authorizationProfile] !== decryptedToken.id) {
        return res.status(401).send({
          body: { status_code: 401, status: 'fail', message: 'Profile not found!' },
        });
      }
      const foundProfileByToken: ProfileInterface | undefined = profiles.find(
        (profile) => profile.id === decryptedToken.id
      );
      if (!foundProfileByToken) {
        return res.status(401).send({
          body: { status_code: 401, status: 'fail', message: 'Profile not found, activate the support!' },
        });
      }
      res.locals.foundProfileByToken = foundProfileByToken;
      next();
    } catch (error) {
      return res.status(400).send({
        body: { status_code: 400, status: 'fail', message: error },
      });
    }
  }
}
