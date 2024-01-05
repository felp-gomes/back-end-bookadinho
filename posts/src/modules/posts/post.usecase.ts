import { randomUUID } from 'crypto';
import { prismaClient } from '../../infra/database/prisma/prisma.js';
import { PostValidation } from './dtos/posts.dtos.js';

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
  public async getPostByUserId(isGetAllPosts: boolean, userId: string, quantityPosts = 10, page = 0) {
    try {
      return await prismaClient.posts.findMany({
        where: {
          user_id: userId,
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
  public async createPost(data: { user_id: string; text: string }) {
    try {
      if (!data.text) {
        throw new Error('ERR:DATABASE:0001', {
          cause: 'Invalid text for save database!',
        });
      }
      const postValidation = PostValidation.safeParse({ id: randomUUID(), ...data });
      if (!postValidation.success) throw postValidation.error;
      return await prismaClient.posts.create({
        data,
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
