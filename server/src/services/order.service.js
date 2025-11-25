import Order from '../model/order.model.js';
import Shop from '../model/shop.model.js';

//* Service for placing Order
const placeOrderService = async (
  cartItems,
  paymentMethod,
  deliveryAddress,
  totalAmount,
  userId
) => {
  if (cartItems.length === 0 || !cartItems) {
    throw new Error('Cart is empty');
  }
  if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
    throw new Error('Send complete address');
  }
  if (!paymentMethod) {
    throw new Error('Payment method is required');
  }

  // group items by shop
  const groupItemsByShop = {};

  cartItems.forEach(item => {
    const shopId = item.shop;
    if (!groupItemsByShop[shopId]) {
      groupItemsByShop[shopId] = [];
    }
    groupItemsByShop[shopId].push(item);
  });

  const shopOrders = await Promise.all(
    Object.keys(groupItemsByShop).map(async shopId => {
      const shop = await Shop.findById(shopId).populate('owner');
      if (!shop) {
        throw new Error('Shop not found');
      }
      const items = groupItemsByShop[shopId];
      const subtotal = items.reduce((sum, curr) => sum + curr.price * curr.quantity, 0);

      return {
        shop: shop._id,
        owner: shop.owner._id,
        subtotal,
        shopOrderItems: items.map(item => ({
          item: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
      };
    })
  );

  const order = await Order.create({
    user: userId,
    paymentMethod,
    deliveryAddress,
    totalAmount,
    shopOrders,
  });

  return order;
};

//* Service for getting user orders
const getUserOrdersService = async userId => {
  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('shopOrders.shop', 'name')
      .populate('shopOrders.owner', 'name email mobile')
      .populate('shopOrders.shopOrderItems.item', 'name image price');

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

//* Service for getting owner orders
const getOwnerOrdersService = async ownerId => {
  try {
    const orders = await Order.find({ 'shopOrders.owner': ownerId })
      .sort({ createdAt: -1 })
      .populate('shopOrders.shop', 'name')
      .populate('user')
      .populate('shopOrders.shopOrderItems.item', 'name image price');

    return orders;
  } catch (error) {
    console.error('Error fetching owner orders:', error);
    throw error;
  }
};

//* Service for getting orders
const getOrdersService = async (userId, userRole) => {
  try {
    if (userRole === 'user') {
      return await getUserOrdersService(userId);
    } else if (userRole === 'owner') {
      return await getOwnerOrdersService(userId);
    } else {
      throw new Error('Invalid user role');
    }
  } catch (error) {
    console.error('Error in getOrdersService:', error);
    throw error;
  }
};

//* Export services
export { placeOrderService, getOrdersService };
