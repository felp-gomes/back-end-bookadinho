import { Router } from 'express';
import { UserController } from './modules/users/user.controller.js';

const routes = Router();

const userController = new UserController();

routes
  .get('/users', userController.getAllUsers.bind(userController))
  .get('/users/:id', userController.getUserById.bind(userController))
  .post('/users', userController.createUser.bind(userController))
  .post('/users/auth', userController.loginUser.bind(userController));

export default routes;
