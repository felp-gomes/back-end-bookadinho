import { Router } from 'express';
import { UserController } from './modules/users/user.controller.js';
import { Auth } from './middleware/auth.provider.js';

const routes = Router();

const userController = new UserController();
const auth = new Auth();

routes
  .get('/users', userController.getAllUsers.bind(userController))
  .get('/users/:id', userController.getUserById.bind(userController))
  .post('/users', userController.createUser.bind(userController))
  .post('/users/auth', userController.loginUser.bind(userController))
  .put('/users/:id', auth.verifyAuthentication.bind(auth), userController.updateUser.bind(userController))
  .delete('/users/:id', auth.verifyAuthentication.bind(auth), userController.deleteUser.bind(userController));

export default routes;
