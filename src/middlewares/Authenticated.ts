import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

import OAuth from '../models/OAuth.js';

const prismaUsers = new PrismaClient().users;
const prismaAuthorizations = new PrismaClient().authorizations;

export default class Authenticated {
  public static async verifyAuthenticated(req: Request, res: Response, next: NextFunction) {
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
      const { id = '', iat } = OAuth.verifyToken(authorizationProfile) as { id: string; iat: number };
      const dateUnixtime = moment(iat, 'X').format();
      const dateTowDaysLater = moment().add(2, 'day').format();
      const isValidateTimeToken = moment(dateUnixtime).isBefore(dateTowDaysLater);
      if (!isValidateTimeToken) {
        return res.status(401).send({
          body: { status_code: 401, status: 'fail', message: 'Token expired, please log in again!' },
        });
      }
      const foundToken = await prismaAuthorizations.findUnique({ where: { id: authorizationProfile } });
      if (!foundToken) {
        return res.status(404).send({
          body: { status_code: 404, status: 'fail', message: 'Token not found!' },
        });
      }
      const foundUserbyId = await prismaUsers.findUnique({
        where: {
          id,
        },
      });
      res.locals.foundProfileByToken = foundUserbyId;
      next();
    } catch (error) {
      return res.status(400).send({
        body: { status_code: 400, status: 'fail', message: error },
      });
    }
  }
}
