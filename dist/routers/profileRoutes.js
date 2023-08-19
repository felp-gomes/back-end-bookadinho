import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import Authenticated from '../middlewares/Authenticated';
const router = Router();
router
    .get('/profiles', Authenticated.verifyAuthenticated, ProfileController.listProfiles)
    .post('/profile/authorization', ProfileController.authenticateProfile)
    .post('/profile', ProfileController.createProfile)
    .put('/profile', Authenticated.verifyAuthenticated, ProfileController.editProfile)
    .delete('/profile', Authenticated.verifyAuthenticated, ProfileController.deleteProfile)
    .put('/profile/password', Authenticated.verifyAuthenticated, ProfileController.resetPassword);
export default router;
//# sourceMappingURL=profileRoutes.js.map