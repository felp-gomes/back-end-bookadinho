import { Request, Response } from 'express';
import { UserUsecase } from './user.usecase.js';

export class UserController {
  private userUsecase = new UserUsecase();

  constructor() {}

  public async getAllUsers(request: Request, response: Response) {
    const { allusers: allUsers = true } = request.query;
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
}
