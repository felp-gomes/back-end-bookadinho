import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import books from '../mocks/books.js';
import { ProfileInterface } from '../interfaces/profile.js';
import { BookValidation, BookInterface } from '../interfaces/book.js';
import { debugLogError } from '../utils/utils.js';

const prismaBooks = new PrismaClient().books;

export default class BookController {
  static async listBooks(req: Request, res: Response) {
    try {
      const books = await prismaBooks.findMany({
        where: {
          is_deleted: false,
          is_changed: false,
        },
      });
      return res.status(202).send({ body: { status_code: 202, status: 'sucess', books: books } });
    } catch (error) {
      debugLogError('ERROR LISTBOOKS', error);
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal server error!' } });
    }
  }
  static async listBookById(req: Request, res: Response) {
    const { id: idBook } = req.params;
    try {
      const bookById = await prismaBooks.findUnique({
        where: {
          id: idBook,
          is_deleted: false,
        },
      });
      return bookById
        ? res.status(202).send({ body: { status_code: 202, status: 'sucess', book: [bookById] } })
        : res.status(404).send({ body: { status_code: 404, status: 'fail', message: 'Not found book by id!' } });
    } catch (error) {
      debugLogError('ERROR LISTBOOKBYID', error);
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal server error!' } });
    }
  }
  static async createBook(req: Request, res: Response) {
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
    try {
      const validateDataBook = BookValidation.safeParse({
        id: randomUUID(),
        name: name,
        author: author,
        description: description,
        photo: photo,
        is_changed: false,
        is_read: is_read,
        is_deleted: false,
        user_id: foundProfileByToken.id,
      });
      if (!validateDataBook?.success) {
        throw validateDataBook.error;
      }
      const book: BookInterface = await prismaBooks.create({
        data: {
          ...validateDataBook.data,
        },
      });
      return res.status(201).send({ body: { status_code: 201, status: 'sucess', book: book } });
    } catch (error) {
      debugLogError('ERROR CREATEBOOK', error);
      if (error.name === 'PrismaClientValidationError') {
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: 'It was not possible to save to the database, check that you are passing all the data correctly!',
          },
        });
      }
      if (error.name === 'ZodError') {
        const { errors } = error;
        let messageError = '';
        errors.forEach(
          (error: { path: Array<1>; message: string }) =>
            (messageError += `The parameter \\${error.path[0]}\\ ${error.message};\n`)
        );
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      }
    }
  }
  static editBook(req: Request, res: Response) {
    const bookEditId: string = req.params.id;
    const { name, author, description, photo } = req.body;
    if (name && (name.length < 1 || name.length > 256)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Name must be less than 256 characters!',
        },
      });
    }
    if (author && (author.length < 1 || author.length > 256)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Author must be less than 256 characters!',
        },
      });
    }
    if (description && (description.length < 1 || description.length > 256)) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Description must be less than 256 characters!',
        },
      });
    }
    if (photo && photo.length < 1) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Description must be down than 0 characters!',
        },
      });
    }
    if (!name && !author && !description && !photo) {
      return res.status(403).send({
        body: {
          status_code: 403,
          status: 'fail',
          message: 'Someone name, author, description, photo and read if required!',
        },
      });
    }
    const foundBookIndex = books.findIndex(({ id }) => id === bookEditId);
    if (foundBookIndex === -1) {
      return res.status(404).send({
        body: {
          status_code: 404,
          status: 'fail',
          message: 'Book id not found!',
        },
      });
    }
    const updatedBook: BookInterface = {
      ...books[foundBookIndex],
      name: name ? name.trim() : books[foundBookIndex].name,
      author: author ? author.trim() : books[foundBookIndex].author,
      description: description ? description.trim() : books[foundBookIndex].description,
      photo: photo ? photo.trim() : books[foundBookIndex].photo,
    };
    books[foundBookIndex] = updatedBook;
    return res.status(202).send({ body: { status_code: 202, status: 'sucess', book: updatedBook } });
  }
  static readBook(req: Request, res: Response) {
    const bookEditId: string = req.params.id;
    const foundBookIndex = books.findIndex(({ id }) => id === bookEditId);
    if (foundBookIndex === -1) {
      return res.status(404).send({
        body: {
          status_code: 404,
          status: 'fail',
          message: 'Book id not found!',
        },
      });
    }
    if (books[foundBookIndex].is_read) {
      return res.status(304).send({
        body: {
          status_code: 304,
          status: 'fail',
          message: 'Book is already marked as read!',
        },
      });
    }
    books[foundBookIndex].is_read = true;
    return res.status(202).send({ body: { status_code: 202, status: 'sucess', book: books[foundBookIndex] } });
  }
  static changeBook(req: Request, res: Response) {
    const bookEditId: string = req.params.id;
    const foundBookIndex = books.findIndex(({ id }) => id === bookEditId);
    if (foundBookIndex === -1) {
      return res.status(404).send({
        body: {
          status_code: 404,
          status: 'fail',
          message: 'Book id not found!',
        },
      });
    }
    if (books[foundBookIndex].is_changed) {
      return res.status(304).send({
        body: {
          status_code: 304,
          status: 'fail',
          message: 'Book has already been changed!',
        },
      });
    }
    books[foundBookIndex].is_changed = true;
    return res.status(202).send({ body: { status_code: 202, status: 'sucess', book: books[foundBookIndex] } });
  }
  static deleteBook(req: Request, res: Response) {
    const bookEditId: string = req.params.id;
    const foundBookIndex = books.findIndex(({ id }) => id === bookEditId);
    if (foundBookIndex === -1) {
      return res.status(404).send({
        body: {
          status_code: 404,
          status: 'fail',
          message: 'Book id not found!',
        },
      });
    }
    books.splice(foundBookIndex, 1);
    return res.status(202).send({ body: { status_code: 202, status: 'sucess', message: 'Book deleted!' } });
  }
}
