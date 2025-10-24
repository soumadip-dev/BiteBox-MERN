import { Router } from 'express';
import { createAndEditShop, getMyShop } from '../controller/shop.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/create-edit', isAuth, createAndEditShop);
router.get('/', isAuth, getMyShop);

//* Export the router
export default router;
