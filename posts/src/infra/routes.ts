import { Router } from 'express';
import { PostController } from '../modules/posts/post.controller.js';
import { Auth } from '../middleware/auth.provider.js';
import { ExceptionRoutesController } from '../modules/errors/exceptionRoutes.controller.js';

const routes = Router();

const postController = new PostController();
const auth = new Auth();

routes
  .get('/posts/:allposts(true)?', postController.getAllPosts.bind(postController))
  .get('/posts/:id', postController.getPostById.bind(postController))
  .get('/posts/user/:id/:allposts(true)?', postController.getPostByUserId.bind(postController))
  .post('/posts', auth.verifyAuthentication.bind(auth), postController.createPost.bind(postController))
  .patch('/posts/:id', auth.verifyAuthentication.bind(auth), postController.updatePost.bind(postController))
  .delete('/posts/:id', auth.verifyAuthentication.bind(auth), postController.deletePost.bind(postController))
  .get('/', new ExceptionRoutesController().routeRoot);

export default routes;
