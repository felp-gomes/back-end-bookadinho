import { Router } from 'express';
import BookController from '../controllers/BookController';
import Authenticated from '../middlewares/Authenticated';

const router = Router();

<<<<<<< HEAD
router.get('/books', BookController.listBooks).get('/book/:id', BookController.listBookById);
=======
router
  .get('/books', BookController.listBooks)
  .get('/book/:id', BookController.listBookById)
  .post('/book', Authenticated.verifyAuthenticated, BookController.createBook);
>>>>>>> a054de523e22bb2cab134bdfae26a4a7b770bca0

export default router;
