import { Router } from 'express';
import { BookController } from '../modules/books/book.usecontroller.js';
import { FavoriteBooksController } from '../modules/favorite_books/favoritebooks.usecontroller.js';
import { Auth } from '../middleware/auth.provider.js';
import { ExceptionRoutesController } from '../modules/errors/exceptionRoutes.controller.js';

const routes = Router();

const bookController = new BookController();
const favoriteBooksController = new FavoriteBooksController();
const auth = new Auth();

routes
  .get(
    '/books/favorite/user/:owner_id/book/:book_id',
    auth.verifyAuthentication.bind(auth),
    favoriteBooksController.getFavoriteBookByUserIdAndBookId.bind(favoriteBooksController)
  )
  .get(
    '/books/favorite/user/:id',
    auth.verifyAuthentication.bind(auth),
    favoriteBooksController.getAllFavoriteBooksByUserId.bind(favoriteBooksController)
  )
  .get(
    '/books/favorite/book/:id',
    auth.verifyAuthentication.bind(auth),
    favoriteBooksController.getFavoriteBooksById.bind(favoriteBooksController)
  )
  .post(
    '/books/favorite',
    auth.verifyAuthentication.bind(auth),
    favoriteBooksController.createFavoriteBook.bind(favoriteBooksController)
  )
  .delete(
    '/books/favorite',
    auth.verifyAuthentication.bind(auth),
    favoriteBooksController.deleteFavoriteBook.bind(favoriteBooksController)
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
