import { Request, Response } from 'express';
import books from '../mocks/books';
import { ProfileInterface } from '../interfaces/profile';
import { BookInterface } from '../interfaces/book';

export default class BookController {
  static listBooks(req: Request, res: Response) {
    return res.status(202).send({ body: { status_code: 202, status: 'sucess', books } });
  }
  static listBookById(req: Request, res: Response) {
    const idBook = req.params.id;
    const bookById = books.find((book) => book.id === idBook);
    return bookById
      ? res.status(202).send({ body: { status_code: 202, status: 'sucess', book: bookById } })
      : res.status(404).send({ body: { status_code: 404, status: 'sucess', message: 'Not found book by id!' } });
  }
  static createBook(req: Request, res: Response) {
    const foundProfileByToken: ProfileInterface = res.locals.foundProfileByToken;
    const { name, author, description, photo, is_read } = req.body;
    if (!name || !author || !description || typeof is_read !== 'boolean') {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Name, author, description, photo and read if required!',
        },
      });
    }
    if (name.length > 256) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Name must be less than 256 characters!',
        },
      });
    }
    if (author.length > 256) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Author must be less than 256 characters!',
        },
      });
    }
    if (description.length > 256) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Description must be less than 256 characters!',
        },
      });
    }
    const newBook: BookInterface = {
      id: `${books.length + 1}`,
      name,
      author,
      description,
      photo,
      is_read,
      is_change: false,
      profile: {
        id: foundProfileByToken.id,
        user_name: foundProfileByToken.user_name,
      },
    };
    books.push(newBook);
    return res.status(201).send({ body: { status_code: 201, status: 'sucess', book: newBook } });
  }
}
