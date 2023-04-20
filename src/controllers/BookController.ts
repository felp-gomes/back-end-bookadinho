import { Request, Response } from 'express';
import books from '../mocks/books';

export default class BookController {
  static listBooks(req: Request, res: Response) {
    res.status(200).json(books);
  }

  static listBookById(req: Request, res: Response) {
    const idBook = req.params.id;
    const bookById = books.find((book) => book.id === idBook);
    res.status(200).json(bookById);
  }
}
