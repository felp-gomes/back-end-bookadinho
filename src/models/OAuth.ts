import Webtoken from 'jsonwebtoken';
class WebToken {
  public static createToken(user: { id: string }) {
    try {
      const token = Webtoken.sign(user, 'bola', {
        algorithm: 'HS256',
      });
      return token;
    } catch (error) {
      throw `${error}`;
    }
  }

  public static verifyToken(token: string) {
    try {
      const tokenInformation: unknown = Webtoken.verify(token, 'bola');
      return tokenInformation;
    } catch (error) {
      throw `${error}`;
    }
  }
}

export default WebToken;
