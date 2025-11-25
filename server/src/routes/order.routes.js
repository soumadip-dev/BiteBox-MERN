import { Router } from 'express';
import { placeOrder, getOrders } from '../controller/order.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/place-order', isAuth, placeOrder);
router.get('/get-orders', isAuth, getOrders);

//* Export the router
export default router;
