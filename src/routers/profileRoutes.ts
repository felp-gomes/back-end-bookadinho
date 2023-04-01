import express from 'express';
import ProfileController from '../controllers/ProfileController';

const router = express.Router();

router
  .get('/profiles', ProfileController.listProfiles)
  .post('/profile/authorization', ProfileController.authenticateProfile);

export default router;
