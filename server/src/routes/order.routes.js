import { Router } from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
  getDeliveryBoyAssignment,
  acceptOrder,
  getCurrentOrder,
  getOrderById,
} from '../controller/order.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.get('/get-orders', isAuth, getOrders);
router.get('/get-delivery-boy-assignment', isAuth, getDeliveryBoyAssignment);
router.get('/get-current-order', isAuth, getCurrentOrder);
router.get('/get-order-by-id/:orderId', isAuth, getOrderById);
router.put('/update-order-status/:orderId/:shopId', isAuth, updateOrderStatus);
router.put('/accept-order/:assignmentId', isAuth, acceptOrder);
router.post('/place-order', isAuth, placeOrder);
router.post('/send-otp', isAuth, sendDeliveryBoyOtp);

//* Export the router
export default router;
