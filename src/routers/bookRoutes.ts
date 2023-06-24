import { Router } from 'express';
import BookController from '../controllers/BookController';

const router = Router();

router.get('/books', BookController.listBooks).get('/book/:id', BookController.listBookById);

export default router;
