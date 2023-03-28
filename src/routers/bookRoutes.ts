import express from 'express';
import BookController from '../controllers/BookController';

const router = express.Router();

router
  .get('/book', BookController.listBooks)
  .get('/book/:id', BookController.listBookById);

export default router;
