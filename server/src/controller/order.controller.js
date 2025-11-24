import { placeOrderService } from '../services/order.service.js';

//* Controller for placing Order
const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    const userId = req.user._id;

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

//* Export controllers
export { placeOrder };
