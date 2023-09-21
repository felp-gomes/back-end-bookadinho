import { Router } from 'express';
import { UserController } from './modules/users/user.controller.js';

const routes = Router();

const userController = new UserController();

routes.get('/users', userController.getAllUsers.bind(userController));

export default routes;
