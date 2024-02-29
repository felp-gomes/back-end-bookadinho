import { randomUUID } from 'crypto';
import { prismaClient } from '../../infra/database/prisma/prisma.js';
import { BookValidation } from './dtos/books.dto.js';

export class FavoriteBooksUseCase {
  constructor() {}
  public async getAllFavoriteBooksByUserId(userId: string, quantityBooks = 10, page = 0) {
    try {
      return await prismaClient.favoriteBooks.findMany({
        where: {
          owner_id: userId,
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
  public async getFavoriteBooksById(bookId: string) {
    try {
      return await prismaClient.favoriteBooks.findMany({
        where: {
          book_id: bookId,
        },
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async createFavoriteBook(data: { book_id: string; owner_id: string }) {
    try {
      const bookValidation = BookValidation.safeParse({ id: randomUUID(), ...data });
      if (!bookValidation.success) throw bookValidation.error;
      return await prismaClient.favoriteBooks.create({
        data,
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteFavoriteBook({ book_id, owner_id }: { book_id: string; owner_id: string }) {
    try {
      return await prismaClient.favoriteBooks.delete({
        where: {
          owner_id_book_id: {
            book_id: book_id,
            owner_id: owner_id,
          },
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
