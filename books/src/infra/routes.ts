import { Router } from 'express';
import { BookController } from '../modules/books/book.usecontroller.js';
import { Auth } from '../middleware/auth.provider.js';

const routes = Router();

const bookController = new BookController();
const auth = new Auth();

routes
  .get('/books', bookController.getAllBooks.bind(bookController))
  .get('/books/:id', bookController.getBoosById.bind(bookController))
  .post('/books', bookController.createBook.bind(bookController))
  .put('/books/:id', bookController.updateBook.bind(bookController))
  .delete('/books/:id', bookController.deleteBook.bind(bookController));

export default routes;
