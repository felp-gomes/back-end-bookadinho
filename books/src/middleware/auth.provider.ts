import { Request, Response, NextFunction } from 'express';
import { TokenUsercase } from '../modules/tokens/token.usercase.js';
import jwt from 'jsonwebtoken';

export class Auth {
  private tokenUserCase = new TokenUsercase();
  constructor() {}

  public async verifyAuthentication(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers;
    if (!authorization) {
      return response.status(401).send({
        body: {
          status_code: 401,
          status: 'fail',
          message: 'AuthorizationProfile is required!',
        },
      });
    }
    try {
      // this.tokenUserCase.verifyToken(authorization);
      const tokenConsulted = await this.tokenUserCase.getToken(authorization);
      if (!tokenConsulted) {
        return response.status(401).json({
          body: {
            status_code: 401,
            status: 'fail',
            message: 'Invalid token for the request!',
          },
        });
      }
      response.locals.owner_id = tokenConsulted.owner_id;
      return next();
    } catch (error: unknown) {
      this.handleError(error);
      if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        return response.status(401).json({
          body: {
            status_code: 401,
            status: 'fail',
            message: 'Invalid token for the request!',
          },
        });
      }
      return response.status(500).json({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'Internal Server Error!',
        },
      });
    }
  }
  private handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
