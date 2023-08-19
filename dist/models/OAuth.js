import { sign, verify } from 'jsonwebtoken';
class WebToken {
    static createToken(user) {
        try {
            const token = sign(user, 'bola', {
                algorithm: 'HS256',
            });
            return token;
        }
        catch (error) {
            throw `${error}`;
        }
    }
    static verifyToken(token) {
        try {
            const tokenInformation = verify(token, 'bola');
            return tokenInformation;
        }
        catch (error) {
            throw `${error}`;
        }
    }
}
export default WebToken;
//# sourceMappingURL=OAuth.js.map