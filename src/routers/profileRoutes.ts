import express from 'express';
import ProfileController from '../controllers/ProfileController';
import Authenticated from '../middlewares/Authenticated';

const router = express.Router();

router
  .get('/profiles', Authenticated.verifyAuthenticated, ProfileController.listProfiles)
  .post('/profile/authorization', ProfileController.authenticateProfile)
  .post('/profile', ProfileController.createProfile);

export default router;
