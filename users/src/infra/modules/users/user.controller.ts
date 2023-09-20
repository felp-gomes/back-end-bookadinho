import { Request, Response } from 'express';
import { UserUsecase } from './user.usecase.js';

export class UserController {
  private userUsecase: UserUsecase;

  constructor() {
    this.userUsecase = new UserUsecase();
  }

  public async getAllUsers(request: Request, response: Response) {
    console.log(this.userUsecase);
    // this.userUsecase.getAllUsers(true);
  }
}
