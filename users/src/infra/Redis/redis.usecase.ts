import { redis } from '../../infra/database/redis/index.js';

export class RedisUsecase {
  constructor() {}

  protected async getValueKey(key: string) {
    try {
      return await redis.get(key);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  protected async setKey(key: string, value: string, duration: number) {
    try {
      await redis.set(key, value, {
        EX: duration,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  protected async getKeys(key: string) {
    try {
      return await redis.keys(key);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  protected async deleteKeys(key: string) {
    try {
      const keys = await this.getKeys(key);
      await redis.del(keys.length === 0 ? '' : keys);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
