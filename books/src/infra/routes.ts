import { Router } from 'express';
import { BookController } from '../modules/books/book.usecontroller.js';
import { FavoriteBooksController } from '../modules/favorite_books/favoritebooks.usecontroller.js';
import { Auth } from '../middleware/auth.provider.js';
import { ExceptionRoutesController } from '../modules/errors/exceptionRoutes.controller.js';

const routes = Router();

const bookController = new BookController();
const savedBooksController = new FavoriteBooksController();
const auth = new Auth();

routes
  .get(
    '/books/favorite/user/:id',
    auth.verifyAuthentication.bind(auth),
    savedBooksController.getAllFavoriteBooksByUserId.bind(savedBooksController)
  )
  .post(
    '/books/favorite',
    auth.verifyAuthentication.bind(auth),
    savedBooksController.createFavoriteBook.bind(savedBooksController)
  )
  .delete(
    '/books/favorite',
    auth.verifyAuthentication.bind(auth),
    savedBooksController.deleteFavoriteBook.bind(savedBooksController)
  );

routes
  .get('/books/:allbooks(true)?', bookController.getAllBooks.bind(bookController))
  .get('/books/:id', bookController.getBookById.bind(bookController))
  .get('/books/user/:id/:allbooks(true)?', bookController.getBooksByUserId.bind(bookController))
  .post('/books', auth.verifyAuthentication.bind(auth), bookController.createBook.bind(bookController))
  .put('/books/:id', auth.verifyAuthentication.bind(auth), bookController.updateBook.bind(bookController))
  .delete('/books/:id', auth.verifyAuthentication.bind(auth), bookController.deleteBook.bind(bookController))
  .get('/', new ExceptionRoutesController().routeRoot);

export default routes;
