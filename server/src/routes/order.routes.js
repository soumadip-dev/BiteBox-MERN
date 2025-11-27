import { Router } from 'express';
import { placeOrder, getOrders, updateOrderStatus } from '../controller/order.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/place-order', isAuth, placeOrder);
router.get('/get-orders', isAuth, getOrders);
router.put('/update-order-status/:orderId/:shopId', isAuth, updateOrderStatus);

//* Export the router
export default router;
