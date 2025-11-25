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
  const orders = (await Order.find({ user: userId }))
    .toSorted({ createdAt: -1 })
    .populate('shopOrders.shop', 'name')
    .populate('shopOrders.owner', 'name email mobile')
    .populate('shopOrders.shopOrderItems.item', 'name image price');
  return orders;
};

//* Service for getting owner orders
const getOwnerOrdersService = async ownerId => {
  const orders = (await Order.find({ 'shopOrders.owner': ownerId }))
    .toSorted({ createdAt: -1 })
    .populate('shopOrders.shop', 'name')
    .populate('user')
    .populate('shopOrders.shopOrderItems.item', 'name image price');
  return orders;
};

//* Service for getting orders
const getOrdersService = async (userId, userRole) => {
  if (userRole === 'user') {
    return getUserOrdersService(userId);
  } else if (userRole === 'owner') {
    return getOwnerOrdersService(userId);
  }
};

//* Export services
export { placeOrderService, getOrdersService };
