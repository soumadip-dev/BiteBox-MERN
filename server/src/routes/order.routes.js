import { Router } from 'express';
import { getOwnerOrders, getUserOrders, placeOrder } from '../controller/order.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/place-order', isAuth, placeOrder);
router.get('/get-user-orders', isAuth, getUserOrders);
router.get('/get-owner-orders', isAuth, getOwnerOrders);

//* Export the router
export default router;
