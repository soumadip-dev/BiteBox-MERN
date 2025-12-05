import { Router } from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
  getDeliveryBoyAssignment,
  acceptOrder,
} from '../controller/order.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/place-order', isAuth, placeOrder);
router.get('/get-orders', isAuth, getOrders);
router.put('/update-order-status/:orderId/:shopId', isAuth, updateOrderStatus);
router.get('/get-delivery-boy-assignment', isAuth, getDeliveryBoyAssignment);
router.put('/accept-order/:assignmentId', isAuth, acceptOrder);

//* Export the router
export default router;
