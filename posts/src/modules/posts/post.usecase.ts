import { prismaClient } from '../../infra/database/prisma/prisma.js';

export class PostUsercase {
  constructor() {}

  public async getAllPosts(isGetAllPosts: boolean, quantityPosts = 10, page = 0) {
    try {
      return await prismaClient.posts.findMany({
        where: {
          is_deleted: isGetAllPosts ? undefined : false,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: quantityPosts * page,
        take: quantityPosts,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async getPostById(postId: string) {
    try {
      return await prismaClient.posts.findFirst({
        where: {
          id: postId,
        },
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
