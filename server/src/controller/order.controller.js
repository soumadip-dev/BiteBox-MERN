import {
  placeOrderService,
  getOrdersService,
  updateOrderStatusService,
  getDeliveryBoyAssignmentService,
  acceptOrderService,
  getCurrentOrderService,
  getOrderByIdService,
  sendDeliveryBoyOtpService,
  verifyDeliveryBoyOtpService,
  verifyPaymentService,
} from '../services/order.service.js';
import generateMailOptions from '../utils/mailTemplates.utils.js';
import transporter from '../config/nodemailer.config.js';
import { ENV } from '../config/env.config.js';

//* Controller for placing Order
const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    const userId = req.userId;

    const result = await placeOrderService(
      cartItems,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      userId
    );

    res.status(201).json({
      message: 'Order placed successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for verifying payment
const verifyPayment = async (req, res) => {
  try {
    const { OrderId, razorpayPaymentId } = req.body;

    const order = await verifyPaymentService(OrderId, razorpayPaymentId);

    res.status(200).json({
      message: 'Payment verified successfully',
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for getting orders
const getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const orders = await getOrdersService(userId, userRole);

    res.status(200).json({
      message: 'Orders fetched successfully',
      success: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for updating order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const { updatedShopOrder, deliveryBoysPayload } = await updateOrderStatusService(
      orderId,
      shopId,
      status
    );

    res.status(200).json({
      message: 'Order status updated successfully',
      success: true,
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for getting delivery boy assignment
const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await getDeliveryBoyAssignmentService(deliveryBoyId);

    return res.status(200).json({
      message: 'Assignments fetched successfully',
      success: true,
      assignments,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for accepting order
const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.userId;

    await acceptOrderService(assignmentId, userId);

    res.status(200).json({
      message: 'Order accepted successfully.',
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for getting current order
const getCurrentOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const data = await getCurrentOrderService(userId, userRole);

    return res.status(200).json({
      message: 'Current order fetched successfully',
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for getting order by id
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderByIdService(orderId);

    return res.status(200).json({
      message: 'Order fetched successfully',
      success: true,
      order,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for sending delivery boy otp
const sendDeliveryBoyOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;

    const userId = req.userId;

    const { customerName, customerEmail, generatedOTP } = await sendDeliveryBoyOtpService(
      orderId,
      shopOrderId,
      userId
    );

    const mailOptions = generateMailOptions({
      user: {
        fullName: customerName,
        email: customerEmail,
      },
      otp: generatedOTP,
      type: 'deliveryOTP',
      companyName: ENV.COMPANY_NAME,
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      return res
        .status(500)
        .json({ message: emailError.message || 'Email sending failed', success: false });
    }

    res.status(200).json({
      message: 'Otp sent successfully.',
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Controller for verifying delivery boy otp
const verifyDeliveryBoyOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;

    await verifyDeliveryBoyOtpService(orderId, shopOrderId, otp);

    res.status(200).json({
      message: 'Order delivered successfully.',
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

//* Export controllers
export {
  placeOrder,
  getOrders,
  updateOrderStatus,
  getDeliveryBoyAssignment,
  acceptOrder,
  getCurrentOrder,
  getOrderById,
  sendDeliveryBoyOtp,
  verifyDeliveryBoyOtp,
  verifyPayment,
};
