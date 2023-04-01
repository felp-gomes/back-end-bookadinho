import jwt from 'jsonwebtoken';
class WebToken {
  static createToken(user: { id: string; user_name: string }) {
    try {
      const token: unknown = jwt.sign(user, process.env.SECRET_KEY_JWT!, {
        algorithm: 'HS256',
      }) as jwt.SignOptions;
      if (typeof token !== 'string') {
        throw 'REQUEST TOKEN DIFFERENT FROM STRING';
      }
      return token as string;
    } catch (error) {
      throw 'REQUEST TOKEN ERROR';
    }
  }
}

export default WebToken;
