import { prismaClient } from '../../infra/database/prisma.js';
import { randomUUID } from 'node:crypto';
import { BookValidation, BookValidationUpdated } from './dtos/books.dto.js';

export class BookUsecase {
  constructor() {}
  public async getAllBooks(
    isGetSomeBooksActive: boolean | undefined = undefined,
    quantityBooks = 10,
    page = 0,
    searchName: string | undefined,
    searchAuthor: string | undefined
  ) {
    try {
      return await prismaClient.books.findMany({
        where: {
          AND: {
            is_deleted: isGetSomeBooksActive ? undefined : false,
            name: {
              contains: searchName,
            },
            author: {
              contains: searchAuthor,
            },
          },
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
  public async getBookById(bookId: string) {
    try {
      return await prismaClient.books.findUnique({
        where: {
          id: bookId,
        },
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async getBooksByUserId(allBooks: boolean, userId: string, quantityBooks = 10, page = 0) {
    const user = await prismaClient.owners.findFirst({
      where: {
        external_id: userId,
      },
    });
    if (!user) {
      return null;
    }
    console.log(user);
    return await prismaClient.books.findMany({
      where: {
        owner_id: user.id,
        is_deleted: allBooks ? true : false,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: quantityBooks * page,
      take: quantityBooks,
    });
  }
  public async createBook(data: {
    name: string;
    author: string;
    description: string;
    photo: string;
    is_changed: boolean;
    is_read: boolean;
    is_deleted: boolean;
    rate: string;
    owner_id: string;
  }) {
    try {
      const bookValidation = BookValidation.safeParse({ id: randomUUID(), ...data });
      if (!bookValidation.success) throw bookValidation.error;
      return await prismaClient.books.create({
        data,
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async updateBook(
    bookId: string,
    data: {
      name?: string;
      author?: string;
      description?: string;
      photo?: string;
      is_changed?: boolean;
      is_read?: boolean;
      is_deleted?: boolean;
      rate?: string;
    }
  ) {
    try {
      const bookValidation = BookValidationUpdated.safeParse({ id: bookId, ...data });
      if (!bookValidation.success) throw bookValidation.error;
      return await prismaClient.books.update({
        where: {
          id: bookId,
        },
        data,
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async deleteBook(bookId: string) {
    try {
      return await prismaClient.books.delete({
        where: {
          id: bookId,
        },
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async getDBBook(
    where: {
      id?: string;
      name?: string;
      author?: string;
      description?: string;
      photo?: string;
      is_changed?: boolean;
      is_read?: boolean;
      is_deleted?: boolean;
      owner_id?: string;
    },
    select: {
      id: boolean;
      name: boolean;
      author: boolean;
      description: boolean;
      photo: boolean;
      is_changed: boolean;
      is_read: boolean;
      is_deleted: boolean;
      owner_id: boolean;
    }
  ) {
    try {
      return await prismaClient.books.findUnique({
        where: {
          id: where.id,
          name: where.name,
          author: where.author,
          description: where.description,
          photo: where.photo,
          is_changed: where.is_changed,
          is_read: where.is_read,
          is_deleted: where.is_deleted,
          owner_id: where.owner_id,
        },
        select,
      });
    } catch (error) {
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
