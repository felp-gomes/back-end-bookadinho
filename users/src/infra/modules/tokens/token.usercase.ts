import jwt from 'jsonwebtoken';

export class tokenUserCase {
  private key = process.env.JWT_KEY || 'bola';
  constructor() {}

  public createToken(user: { id: string; timesTamp: number }) {
    try {
      return jwt.sign(user, this.key, {
        algorithm: 'HS256',
      });
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  public verifyToken(token: string) {
    try {
      return jwt.verify(token, this.key);
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
