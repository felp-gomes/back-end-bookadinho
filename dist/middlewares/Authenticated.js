import OAuth from '../models/OAuth';
import profiles from '../mocks/profiles';
import authorizations from '../mocks/authorizations';
export default class Authenticated {
    static verifyAuthenticated(req, res, next) {
        const authorizationProfile = req.headers.authorization;
        if (!authorizationProfile) {
            return res.status(401).send({
                body: {
                    status_code: 401,
                    status: 'fail',
                    message: 'AuthorizationProfile is required!',
                },
            });
        }
        try {
            const decryptedToken = OAuth.verifyToken(authorizationProfile);
            if (authorizations[authorizationProfile] !== decryptedToken.id) {
                return res.status(401).send({
                    body: { status_code: 401, status: 'fail', message: 'Profile not found!' },
                });
            }
            const foundProfileByToken = profiles.find((profile) => profile.id === decryptedToken.id);
            if (!foundProfileByToken) {
                return res.status(401).send({
                    body: { status_code: 401, status: 'fail', message: 'Profile not found, activate the support!' },
                });
            }
            res.locals.foundProfileByToken = foundProfileByToken;
            next();
        }
        catch (error) {
            return res.status(400).send({
                body: { status_code: 400, status: 'fail', message: error },
            });
        }
    }
}
//# sourceMappingURL=Authenticated.js.map