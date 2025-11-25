import {
  placeOrderService,
  getUserOrdersService,
  getOwnerOrdersService,
} from '../services/order.service.js';

//* Controller for placing Order
const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    const userId = req.userId;

    const order = await placeOrderService(
      cartItems,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      userId
    );

    res.status(201).json({
      message: 'Order placed successfully',
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

//* Controller for getting user orders
const getUserOrders = async (req, res) => {
  try {
    const uderId = req.userId;
    const orders = await getUserOrdersService(uderId);

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

//* Controller for getting owner orders
const getOwnerOrders = async (req, res) => {
  try {
    const ownerId = req.userId;
    const orders = await getOwnerOrdersService(ownerId);

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

//* Export controllers
export { placeOrder, getUserOrders, getOwnerOrders };
