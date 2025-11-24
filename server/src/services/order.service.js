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
          item: item._id,
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

//* Export services
export { placeOrderService };
