import { Router } from 'express';
import { getCurrentUser } from '../controller/user.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.get('/current', isAuth, getCurrentUser);

//* Export the router
export default router;
