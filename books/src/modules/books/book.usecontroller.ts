import { Request, Response } from 'express';
import { BookUsecase } from './book.usecase.js';
import { ZodError } from 'zod';

export class BookController {
  private bookUseCase = new BookUsecase();
  constructor() {}

  public async getAllBooks(request: Request, response: Response) {
    const { allbooks: allBooks = false } = request.query;
    try {
      const booksConsulted = await this.bookUseCase.getAllBooks(!!allBooks);
      return response.status(200).send({ body: { status_code: 200, status: 'success', books: booksConsulted } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async getBoosById(request: Request, response: Response) {
    const { id: bookId } = request.params;
    try {
      const booksConsultedById = await this.bookUseCase.getBookById(bookId);
      return booksConsultedById
        ? response.status(200).send({ body: { status_code: 200, status: 'success', books: booksConsultedById } })
        : response
            .status(404)
            .send({ body: { status_code: 404, status: 'fail', message: 'User not found by the id provided!' } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async createBook(request: Request, response: Response) {
    const { owner_id = 'd6787723-01a1-466c-9fce-ea903fcbe8b2' } = response.locals;
    const { name, author, description, photo, is_read = false } = request.body;
    try {
      const bookCreated = await this.bookUseCase.createBook({
        name,
        author,
        description,
        photo,
        is_changed: false,
        is_read,
        is_deleted: false,
        owner_id,
      });
      return response.status(202).json({ body: { status_code: 202, status: 'succes', books: bookCreated } });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const { errors } = error;
        let messageError = '';
        errors.forEach((error) => (messageError += `The parameter /${error.path[0]}/ ${error.message}; `));
        return response.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      }
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async updateBook(request: Request, response: Response) {
    const { owner_id = 'd6787723-01a1-466c-9fce-ea903fcbe8b2' } = response.locals;
    const { id: bookId } = request.params;
    const { name, author, description, photo, is_changed, is_read, is_deleted } = request.body;
    if (!bookId) {
      return response.status(400).json({
        body: {
          status_code: 400,
          status: 'fail',
          message: '/bookid/ is required!',
        },
      });
    }
    try {
      const bookConsultedById = await this.bookUseCase.getBookById(bookId);
      if (!bookConsultedById || bookConsultedById.owner_id !== owner_id) {
        return response.status(403).json({
          body: {
            status_code: 403,
            status: 'fail',
            message: 'The user does not own the book!',
          },
        });
      }
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
    try {
      const updatebook = await this.bookUseCase.updateBook(bookId, {
        name,
        author,
        description,
        photo,
        is_changed,
        is_read,
        is_deleted,
      });
      return response.status(200).json({
        body: {
          status_code: 200,
          status: 'succes',
          books: updatebook,
        },
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const { errors } = error;
        let messageError = '';
        errors.forEach((error) => (messageError += `The parameter /${error.path[0]}/ ${error.message}; `));
        return response.status(400).send({
          body: {
            status_code: 400,
            status: 'fail',
            message: messageError,
          },
        });
      }
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async deleteBook(request: Request, response: Response) {
    const { owner_id = 'd6787723-01a1-466c-9fce-ea903fcbe8b2' } = response.locals;
    const { id: bookId } = request.params;
    if (!bookId) {
      return response.status(400).json({
        body: {
          status_code: 400,
          status: 'fail',
          message: '/bookid/ is required!',
        },
      });
    }
    try {
      const bookConsultedById = await this.bookUseCase.getBookById(bookId);
      if (!bookConsultedById || bookConsultedById.owner_id !== owner_id) {
        return response.status(403).json({
          body: {
            status_code: 403,
            status: 'fail',
            message: 'The user does not own the book!',
          },
        });
      }
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }

    try {
      await this.bookUseCase.deleteBook(bookId);
      return response
        .status(200)
        .json({ body: { status_code: 200, status: 'succes', message: 'Book successfully deleted!' } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
}
