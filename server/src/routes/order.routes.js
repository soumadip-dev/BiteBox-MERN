import { Router } from 'express';
import { placeOrder } from '../controller/order.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/place-order', isAuth, placeOrder);

//* Export the router
export default router;
