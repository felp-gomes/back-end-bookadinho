import express from 'express';
import books from '../mocks/books';

export default class BookController {
  static listBooks(req: express.Request, res: express.Response) {
    res.status(200).json(books);
  }

  static listBookById(req: express.Request, res: express.Response) {
    const idBook = req.params.id;
    const bookById = books.find((book) => book.id == idBook);
    res.status(200).json(bookById);
  }
}
