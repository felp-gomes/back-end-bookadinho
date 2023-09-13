import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { ProfileInterface } from '../interfaces/profile.js';
import { BookValidation, BookType } from '../interfaces/book.js';
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
      return res.status(200).send({ body: { status_code: 202, status: 'success', book: books } });
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
        ? res.status(202).send({ body: { status_code: 202, status: 'success', book: [bookById] } })
        : res.status(404).send({ body: { status_code: 404, status: 'fail', message: 'Not found book by id!' } });
    } catch (error) {
      debugLogError('ERROR LISTBOOKBYID', error);
      return res.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal server error!' } });
    }
  }
  static async createBook(req: Request, res: Response) {
    const foundProfileByToken: ProfileInterface = res.locals.foundProfileByToken;
    const {
      name,
      author,
      description,
      photo,
      is_read,
    }: { name: string | null; author: string; description: string; photo: string | null; is_read: boolean } = req.body;
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
      const book: BookType = await prismaBooks.create({
        data: {
          ...validateDataBook.data,
        },
      });
      return res.status(201).send({ body: { status_code: 201, status: 'success', book: book } });
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
      } else if (error.name === 'ZodError') {
        const { errors } = error;
        let messageError = '';
        errors.forEach(
          (error: { path: Array<1>; message: string }) =>
            (messageError += `The parameter /${error.path[0]}/ ${error.message};`)
        );
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      }
      return res.status(500).send({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'The request could not be completed!',
        },
      });
    }
  }
  static async editBook(req: Request, res: Response) {
    const { id: bookEditId } = req.params;
    const {
      name,
      author,
      description,
      photo,
    }: { name: string; author: string; description: string; photo: string | null } = req.body;

    try {
      const bookById = await prismaBooks.findUnique({
        where: {
          id: bookEditId,
          is_deleted: false,
        },
      });

      if (!bookById) {
        return res.status(404).send({
          body: {
            status_code: 404,
            status: 'fail',
            message: 'Book id not found!',
          },
        });
      }
      const validateDataBook = BookValidation.safeParse({
        ...bookById,
        name: name,
        author: author,
        description: description,
        photo: photo,
      });
      if (!validateDataBook?.success) {
        throw validateDataBook.error;
      }
      const updatedBookById = await prismaBooks.update({
        where: {
          id: bookEditId,
        },
        data: {
          ...validateDataBook.data,
        },
      });
      return res.status(200).send({ body: { status_code: 202, status: 'success', book: updatedBookById } });
    } catch (error) {
      if (error.name === 'ZodError') {
        const { errors } = error;
        let messageError = '';
        errors.forEach(
          (error: { path: Array<1>; message: string }) =>
            (messageError += `The parameter /${error.path[0]}/ ${error.message};`)
        );
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      } else if (error.name === 'PrismaClientValidationError') {
        return res.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: 'It was not possible to save to the database, check that you are passing all the data correctly!',
          },
        });
      }
      return res.status(500).send({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'The request could not be completed!',
        },
      });
    }
  }
  static async readBook(req: Request, res: Response) {
    const { id: bookEditId } = req.params;
    try {
      const foundBookById = await prismaBooks.findUnique({
        where: {
          id: bookEditId,
        },
      });
      if (!foundBookById) {
        return res.status(404).send({
          body: {
            status_code: 404,
            status: 'fail',
            message: 'Book id not found!',
          },
        });
      }
      const updatedBookById = await prismaBooks.update({
        where: {
          id: bookEditId,
        },
        data: {
          is_read: !foundBookById.is_read,
        },
      });
      return res.status(202).send({ body: { status_code: 202, status: 'success', book: updatedBookById } });
    } catch (error) {
      return res.status(500).send({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'The request could not be completed!',
        },
      });
    }
  }
  static async changeBook(req: Request, res: Response) {
    const { id: bookEditId } = req.params;
    try {
      const foundBookById = await prismaBooks.findUnique({
        where: {
          id: bookEditId,
        },
      });
      if (!foundBookById) {
        return res.status(404).send({
          body: {
            status_code: 404,
            status: 'fail',
            message: 'Book id not found!',
          },
        });
      }
      const updatedBookById = await prismaBooks.update({
        where: {
          id: foundBookById.id,
        },
        data: {
          is_changed: !foundBookById.is_changed,
        },
      });
      return res.status(202).send({ body: { status_code: 202, status: 'success', book: updatedBookById } });
    } catch (error) {
      return res.status(500).send({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'The request could not be completed!',
        },
      });
    }
  }
  static async deleteBook(req: Request, res: Response) {
    const { id: bookEditId } = req.params;

    try {
      await prismaBooks.delete({
        where: {
          id: bookEditId,
        },
      });
      return res.status(202).send({ body: { status_code: 202, status: 'success', message: 'Book deleted!' } });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).send({
          body: {
            status_code: 404,
            status: 'fail',
            message: 'Book id not found!',
          },
        });
      }
      return res.status(500).send({
        body: {
          status_code: 500,
          status: 'fail',
          message: 'The request could not be completed!',
        },
      });
    }
  }
}
