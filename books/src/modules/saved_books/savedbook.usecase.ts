import { randomUUID } from 'crypto';
import { prismaClient } from '../../infra/database/prisma/prisma.js';
import { BookValidation } from './dtos/books.dto.js';

export class SavedBooksUseCase {
  constructor() {}
  public async getAllSavedBooksByUserId(userId: string, quantityBooks = 10, page = 0) {
    try {
      const user = await prismaClient.owners.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return null;
      }
      return await prismaClient.savedBooks.findMany({
        where: {
          owner_id: user.id,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: quantityBooks * page,
        take: quantityBooks,
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async getSavedBookById(bookId: string) {
    try {
      return await prismaClient.savedBooks.findUnique({
        where: {
          id: bookId,
        },
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async createSavedBook(data: {
    name: string;
    author: string;
    description: string;
    photo: string;
    rate: string;
    owner_id: string;
  }) {
    try {
      const bookValidation = BookValidation.safeParse({ id: randomUUID(), ...data });
      if (!bookValidation.success) throw bookValidation.error;
      return await prismaClient.savedBooks.create({
        data,
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteSavedBook(bookId: string) {
    try {
      return await prismaClient.savedBooks.delete({
        where: {
          id: bookId,
        },
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  private handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
