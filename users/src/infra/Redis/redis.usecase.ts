import { redis } from '../../infra/database/redis/index.js';

export class RedisUseCase {
  constructor() {}

  public async set(key: string, value: string) {
    try {
      await redis.set(key, value, {
        EX: 172800,
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
