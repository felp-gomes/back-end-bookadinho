import jwt from 'jsonwebtoken';
const user = { sub: 1, name: 'John Doe' };
class WebToken {
  static createToken() {
    try {
      const token: unknown = jwt.sign(user, process.env.SECRET_KEY_JWT!, {
        algorithm: 'HS256',
      }) as jwt.SignOptions;
      if (typeof token !== 'string') {
        throw 'REQUEST TOKEN DIFFERENT FROM STRING';
      }
      return token as string;
    } catch (error) {
      console.log('\x1b[31m[REQUEST TOKEN ERROR]\x1b[0m', error);
    }
  }
}

export default WebToken;
