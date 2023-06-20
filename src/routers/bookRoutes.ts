import { Router } from 'express';
import BookController from '../controllers/BookController';
import Authenticated from '../middlewares/Authenticated';

const router = Router();

router
  .get('/books', BookController.listBooks)
  .get('/book/:id', BookController.listBookById)
  .post('/book', Authenticated.verifyAuthenticated, BookController.createBook);

export default router;
