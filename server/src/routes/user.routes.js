import { Router } from 'express';
import { getCurrentUser, updateUserLocation } from '../controller/user.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.get('/current', isAuth, getCurrentUser);
router.put('/update-location', isAuth, updateUserLocation);

//* Export the router
export default router;
