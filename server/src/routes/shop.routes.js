import { Router } from 'express';
import { createAndEditShop } from '../controller/shop.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/create-edit', isAuth, createAndEditShop);

//* Export the router
export default router;
