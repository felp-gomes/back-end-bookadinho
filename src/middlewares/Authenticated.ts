import express from 'express';
import OAuth from '../models/OAuth';
import profiles from '../mocks/profiles';

export default class Authenticated {
  public static verifyAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authorizationProfile = req.headers.authorization as string | undefined;
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
      req.body.foundProfileByToken = foundProfileByToken;
      next();
    } catch (error) {
      return res.status(400).send({
        status: 400,
        body: { message: error },
      });
    }
  }
}
