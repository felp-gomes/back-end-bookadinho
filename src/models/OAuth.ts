import { sign, verify } from 'jsonwebtoken';
class WebToken {
  public static createToken(user: { id: string }) {
    try {
      const token = sign(user, 'bola', {
        algorithm: 'HS256',
      });
      return token;
    } catch (error) {
      throw `${error}`;
    }
  }

  public static verifyToken(token: string) {
    try {
      const tokenInformation: unknown = verify(token, 'bola');
      return tokenInformation;
    } catch (error) {
      throw `${error}`;
    }
  }
}

export default WebToken;
