import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { UserUsecase } from './user.usecase.js';
import { TokenUserCase } from '../tokens/token.usercase.js';

export class UserController {
  private userUsecase = new UserUsecase();
  private tokenUserCase = new TokenUserCase();

  constructor() {}

  public async getAllUsers(request: Request, response: Response) {
    const { allusers: allUsers = false } = request.query;
    try {
      const usersConsulted = await this.userUsecase.getAllUsers(!!allUsers);
      return response.status(200).send({ body: { status_code: 200, status: 'success', users: usersConsulted } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async getUserById(request: Request, response: Response) {
    const { id: userId } = request.params;
    try {
      const userConsultedById = await this.userUsecase.getUserById(userId);
      return userConsultedById
        ? response.status(200).send({ body: { status_code: 200, status: 'success', users: userConsultedById } })
        : response
            .status(404)
            .send({ body: { status_code: 404, status: 'fail', message: 'User not found by the id provided!' } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async createUser(request: Request, response: Response) {
    const {
      user_name,
      name,
      email,
      password,
      description = null,
      likes = [],
      latest_readings = [],
      photo = null,
    }: {
      user_name: string;
      name: string;
      email: string;
      password: string;
      description: string | null;
      likes: [] | null;
      latest_readings: [] | null;
      photo: string | null;
    } = request.body;

    try {
      const userCreated = await this.userUsecase.createUser({
        user_name,
        name,
        email,
        password,
        description,
        likes,
        latest_readings,
        photo,
      });
      return response.status(202).send({
        body: { status_code: 202, status: 'succes', users: userCreated },
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const { errors } = error;
        let messageError = '';
        errors.forEach((error) => (messageError += `The parameter /${error.path[0]}/ ${error.message}; `));
        return response.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      }
      if (error instanceof Error && error.message === 'database-0001') {
        return response.status(409).send({
          body: { status_code: 409, status: 'fail', message: error.cause },
        });
      }
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async loginUser(request: Request, response: Response) {
    const { user_name, password }: { user_name: string; password: string } = request.body;
    if (!user_name || !password) {
      return response.status(403).send({
        body: {
          status_code: 401,
          status: 'fail',
          message: '/username/ and /password/ profile id are required!',
        },
      });
    }
    try {
      const user = await this.userUsecase.getDBUser({ user_name }, { id: true, password: true });
      const validatedPassword = await this.userUsecase.checkPassword(password, user?.password || '');
      if (!user || !validatedPassword) {
        return response.status(401).send({
          body: {
            status_code: 403,
            status: 'fail',
            message: 'Incorrect /username/ or /password/!',
          },
        });
      }
      const tokenByUser = await this.tokenUserCase.createToken(user.id);
      return response.status(200).send({ body: { status_code: 200, status: 'success', token: tokenByUser.id } });
    } catch (error) {
      return response.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal error!' } });
    }
  }
}
