import { Request, Response } from 'express';
import { SavedBooksUseCase } from './savedbook.usecase.js';
import { ZodError } from 'zod';

export class SavedBooksController {
  private savedBooksUseCase = new SavedBooksUseCase();
  constructor() {}

  public async getAllSavedBooksByUserId(request: Request, response: Response) {
    const { id: userId } = request.params;
    const { quantity: quantityBooks = 10, page = 0 } = request.query;
    if (!userId) {
      return response.status(400).json({
        body: {
          status_code: 400,
          status: 'fail',
          message: 'User /id/ is required!',
        },
      });
    }
    if (isNaN(Number(quantityBooks)) || isNaN(Number(page)) || Number(quantityBooks) < 1 || Number(page) < 0) {
      return response.status(400).json({
        body: {
          status_code: 400,
          status: 'fail',
          message: '/quantity/ and /page/ must be positive numbers!',
        },
      });
    }
    try {
      const getAllSavedBooks = await this.savedBooksUseCase.getAllSavedBooksByUserId(
        userId,
        Number(quantityBooks),
        Number(page)
      );
      return response
        .status(200)
        .send({ body: { status_code: 200, status: 'success', saved_books: getAllSavedBooks } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
  public async createSavedBook(request: Request, response: Response) {
    const { owner_id } = response.locals;
    const { name, author, description, photo, rate = null } = request.body;
    if (rate !== null && (Number(rate) < 1 || Number(rate) > 5)) {
      return response.status(400).json({
        body: {
          status_code: 400,
          status: 'fail',
          message: 'The /rate/ must be between 1 and 5!',
        },
      });
    }
    try {
      const bookCreated = await this.savedBooksUseCase.createSavedBook({
        name,
        author,
        description,
        photo,
        rate,
        owner_id,
      });
      return response.status(201).json({ body: { status_code: 201, status: 'succes', books: bookCreated } });
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
  public async deleteSavedBook(request: Request, response: Response) {
    const { owner_id } = response.locals;
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
      const bookConsultedById = await this.savedBooksUseCase.getSavedBookById(bookId);
      if (bookConsultedById?.owner_id !== owner_id) {
        return response.status(403).json({
          body: {
            status_code: 403,
            status: 'fail',
            message: 'The user does not own the saved book!',
          },
        });
      }
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }

    try {
      await this.savedBooksUseCase.deleteSavedBook(bookId);
      return response
        .status(200)
        .json({ body: { status_code: 200, status: 'succes', message: 'Save book successfully deleted!' } });
    } catch (error) {
      return response
        .status(500)
        .send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
}
