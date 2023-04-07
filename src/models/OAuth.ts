import jwt from 'jsonwebtoken';
class WebToken {
  public static createToken(user: { id: string; user_name: string }) {
    try {
      const token = jwt.sign(user, 'bola', {
        algorithm: 'HS256',
      });
      return token;
    } catch (error) {
      throw `${error}`;
    }
  }

  public static verifyToken(token: string) {
    try {
      const tokenInformation: unknown = jwt.verify(token, 'bola');
      return tokenInformation;
    } catch (error) {
      throw `${error}`;
    }
  }
}

export default WebToken;
