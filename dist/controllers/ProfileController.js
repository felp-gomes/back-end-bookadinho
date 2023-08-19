var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import OAuth from '../models/OAuth';
import profiles from '../mocks/profiles';
import authorizations from '../mocks/authorizations';
import { validateProfileEmail } from '../utils/utils';
export default class ProfileController {
    static authenticateProfile(req, res) {
        const { user_name, password } = req.body;
        if (!user_name || !password) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'User name and password profile id are required!',
                },
            });
        }
        const foundProfileIndex = profiles.findIndex((profile) => profile.user_name === user_name && profile.password === password);
        if (foundProfileIndex === -1) {
            return res.status(401).send({
                body: {
                    status_code: 401,
                    status: 'fail',
                    message: 'Incorrect username or password!',
                },
            });
        }
        try {
            const tokenProfile = OAuth.createToken({
                id: profiles[foundProfileIndex].id,
            });
            authorizations[tokenProfile] = profiles[foundProfileIndex].id;
            return res.status(200).send({ body: { status_code: 200, status: 'sucess', authorization: tokenProfile } });
        }
        catch (error) {
            return res.status(400).send({ body: { status_code: 400, status: 'fail', message: error } });
        }
    }
    static listProfiles(req, res) {
        const profileList = [];
        for (const profile of profiles) {
            if (!profile.isActive)
                continue;
            const { password } = profile, newProfile = __rest(profile, ["password"]);
            profileList.push(newProfile);
        }
        return res.status(200).json({ body: { status_cide: 200, status: 'sucess', profiles: profileList } });
    }
    static createProfile(req, res) {
        const { user_name, name, description = '', likes = [], latest_readings = [], photo = '', password, email, } = req.body;
        if (!user_name || !name || !password || !email) {
            return res.status(403).send({
                body: {
                    status_code: 401,
                    status: 'fail',
                    message: 'User name, name, password and email if required!',
                },
            });
        }
        if (profiles.some((profile) => profile.user_name === user_name)) {
            return res.status(409).send({
                body: {
                    status_code: 409,
                    status: 'fail',
                    message: 'Username is already in use!',
                },
            });
        }
        if (profiles.some((profile) => profile.email === email)) {
            return res.status(409).send({
                body: {
                    status_code: 409,
                    status: 'fail',
                    message: 'Email is already in use!',
                },
            });
        }
        if (user_name.length < 4 || user_name.length > 20) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Username must be between 4 and 20 characters!',
                },
            });
        }
        if (name.length < 4 || name.length > 45) {
            return res.status(403).send({
                body: {
                    status_coded: 403,
                    status: 'fail',
                    message: 'Name must be between 4 and 45 characters!',
                },
            });
        }
        if (!validateProfileEmail(email)) {
            return res.status(400).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Not a valid email!',
                },
            });
        }
        if (password.length < 6 || password.length > 45) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Password must be between 6 and 45 characters!',
                },
            });
        }
        if (description.length > 250) {
            return res.status(413).send({
                body: {
                    status_code: 413,
                    status: 'fail',
                    message: 'Description is limited to 250 characters!',
                },
            });
        }
        try {
            const indexProfile = profiles.length + 1;
            const tokenProfile = OAuth.createToken({
                id: String(indexProfile),
            });
            const profile = {
                id: String(indexProfile),
                user_name: user_name.trim(),
                name: name.trim(),
                description: description.trim(),
                likes: likes.map((like) => like.trim()),
                latest_readings: latest_readings.map((latestReadings) => latestReadings.trim()),
                photo: photo.trim(),
                password: password.trim(),
                email: email.trim(),
                isActive: true,
            };
            authorizations[tokenProfile] = String(indexProfile);
            profiles.push(profile);
            return res
                .status(201)
                .send({ body: { status_code: 201, status: 'sucess', profile: profile, token: tokenProfile } });
        }
        catch (error) {
            return res.status(400).send({ body: { status_code: 400, status: 'fail', message: error } });
        }
    }
    static editProfile(req, res) {
        const foundProfileByToken = res.locals.foundProfileByToken;
        const { user_name, name, description, likes, latest_readings, photo, password, email } = req.body;
        if (user_name !== foundProfileByToken.user_name && profiles.some((profile) => profile.user_name === user_name)) {
            return res.status(409).send({
                body: {
                    status_code: 409,
                    status: 'fail',
                    message: 'Username is already in use!',
                },
            });
        }
        if (user_name && (user_name.length < 4 || user_name.length > 20)) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Username must be between 4 and 20 characters!',
                },
            });
        }
        if (name && (name.length < 4 || name.length > 45)) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Name must be between 4 and 45 characters!',
                },
            });
        }
        if (email && !validateProfileEmail(email)) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Not a valid email!',
                },
            });
        }
        if (password && (password.length < 6 || password.length > 45)) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Password must be between 6 and 45 characters!',
                },
            });
        }
        if (description && (description.length < 1 || description.length > 250)) {
            return res.status(413).send({
                body: {
                    status_code: 413,
                    status: 'fail',
                    message: 'Description is limited to 250 characters!',
                },
            });
        }
        const updatedProfile = Object.assign(Object.assign({}, foundProfileByToken), { user_name: user_name ? user_name.trim() : foundProfileByToken.user_name, name: name ? name.trim() : foundProfileByToken.name, description: description ? description.trim() : foundProfileByToken.description, likes: likes ? likes.map((like) => like) : foundProfileByToken.likes, latest_readings: latest_readings
                ? latest_readings.map((latestReadings) => latestReadings)
                : foundProfileByToken.latest_readings, photo: photo ? photo.trim() : foundProfileByToken.photo, password: password ? password.trim() : foundProfileByToken.password, email: email ? email.trim() : foundProfileByToken.email });
        const foundProfileIndex = profiles.findIndex(({ id }) => id === updatedProfile.id);
        for (const authorization in authorizations) {
            if (password && authorizations[authorization] === updatedProfile.id) {
                delete authorizations[authorization];
            }
        }
        profiles[foundProfileIndex] = updatedProfile;
        if (password) {
            return res
                .status(202)
                .send({ body: { status_code: 202, status: 'sucess', message: 'Profile changed successfully!' } });
        }
        return res.status(202).send({ body: { status_code: 202, status: 'sucess', profile: updatedProfile } });
    }
    static deleteProfile(req, res) {
        const foundProfileByToken = res.locals.foundProfileByToken;
        foundProfileByToken.user_name = '';
        foundProfileByToken.name = '';
        foundProfileByToken.description = '';
        foundProfileByToken.photo = '';
        foundProfileByToken.password = '';
        foundProfileByToken.email = '';
        foundProfileByToken.isActive = false;
        const foundProfileIndex = profiles.findIndex(({ id }) => id === foundProfileByToken.id);
        for (const authorization in authorizations) {
            if (authorizations[authorization] === profiles[foundProfileIndex].id) {
                delete authorizations[authorization];
            }
        }
        profiles[foundProfileIndex] = foundProfileByToken;
        return res
            .status(200)
            .send({ body: { status_code: 200, status: 'sucess', message: 'User deleted successfully!' } });
    }
    static resetPassword(req, res) {
        const foundProfileByToken = res.locals.foundProfileByToken;
        const { password } = req.body;
        if (password.length < 6 || password.length > 45) {
            return res.status(403).send({
                body: {
                    status_code: 403,
                    status: 'fail',
                    message: 'Password must be between 6 and 45 characters!',
                },
            });
        }
        foundProfileByToken.password = password;
        const foundProfileIndex = profiles.findIndex(({ id }) => id === foundProfileByToken.id);
        for (const authorization in authorizations) {
            if (password && authorizations[authorization] === profiles[foundProfileIndex].id) {
                delete authorizations[authorization];
            }
        }
        profiles[foundProfileIndex] = foundProfileByToken;
        return res
            .status(202)
            .send({ body: { status_code: 202, status: 'sucess', message: 'Change changed successfully!' } });
    }
}
//# sourceMappingURL=ProfileController.js.map