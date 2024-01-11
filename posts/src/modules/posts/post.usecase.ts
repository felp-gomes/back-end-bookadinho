import { randomUUID } from 'crypto';
import { prismaClient } from '../../infra/database/prisma/prisma.js';
import { PostValidation, PostValidationUpdated } from './dtos/posts.dtos.js';

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
  public async updatePost(postId: string, data: { text: string; user_id: string }) {
    try {
      const postValidation = PostValidationUpdated.safeParse({ id: postId, ...data, is_edited: true });
      if (!postValidation.success) throw postValidation.error;
      return await prismaClient.posts.update({
        where: {
          id: postId,
        },
        data: { ...data, is_edited: true },
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }
  public async deletePost(postId: string) {
    try {
      return await prismaClient.posts.update({
        where: { id: postId },
        data: {
          is_deleted: true,
        },
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  public async getDBPosts(
    where: {
      id?: string;
      text?: string;
      is_deleted?: boolean;
      is_edited?: boolean;
      user_id?: string;
    },
    select: {
      id?: boolean;
      text?: boolean;
      is_deleted?: boolean;
      is_edited?: boolean;
      user_id?: boolean;
    }
  ) {
    try {
      return await prismaClient.posts.findUnique({
        where: {
          id: where.id,
          text: where.text,
          is_deleted: where.is_deleted,
          is_edited: where.is_edited,
          user_id: where.user_id,
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
