import { Router } from 'express';
import { BookController } from '../modules/books/book.usecontroller.js';
import { Auth } from '../middleware/auth.provider.js';

const routes = Router();

const bookController = new BookController();
const auth = new Auth();

routes
  .get('/books', bookController.getAllBooks.bind(bookController))
  .get('/books/:id', bookController.getBoosById.bind(bookController))
  .post('/books', auth.verifyAuthentication.bind(auth), bookController.createBook.bind(bookController))
  .put('/books/:id', auth.verifyAuthentication.bind(auth), bookController.updateBook.bind(bookController))
  .delete('/books/:id', auth.verifyAuthentication.bind(auth), bookController.deleteBook.bind(bookController));

export default routes;
