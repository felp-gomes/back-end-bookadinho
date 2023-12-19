import { Request, Response } from 'express';
import { PostUsercase } from './post.usecase.js';

export class PostController {
  private postUsercase = new PostUsercase();
  constructor() {}

  public async getAllPosts(request: Request, response: Response) {
    const { quantity: quantityPosts = 10, page = 0 } = request.query;
    const { allposts: allPosts = false } = request.params;

    if (isNaN(Number(quantityPosts)) || isNaN(Number(page)) || Number(quantityPosts) < 1 || Number(page) < 0) {
      return response.status(400).json({
        body: {
          status_code: 400,
          status: 'fail',
          message: '/quantity/ and /page/ must be positive numbers!',
        },
      });
    }

    try {
      const postsConsulted = await this.postUsercase.getAllPosts(!!allPosts, Number(quantityPosts), Number(page));
      return response.status(200).send({ body: { status_code: 200, status: 'success', posts: postsConsulted } });
    } catch (error) {
      response.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
    return response.status(200).json('parabens');
  }

  public async getPostById(request: Request, response: Response) {
    const { id: postId } = request.params;
    try {
      const postConsultedById = await this.postUsercase.getPostById(postId);
      return postConsultedById
        ? response.status(200).send({ body: { status_code: 200, status: 'success', posts: postConsultedById } })
        : response
            .status(404)
            .send({ body: { status_code: 404, status: 'fail', message: 'Post not found by the id provided!' } });
    } catch (error) {
      response.status(500).send({ body: { status_code: 500, status: 'fail', message: 'Internal Server Error!' } });
    }
  }
}
