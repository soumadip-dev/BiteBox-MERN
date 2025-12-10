import DeliveryAssignment from '../model/deliveryAssignment.model.js';
import Order from '../model/order.model.js';
import Shop from '../model/shop.model.js';
import User from '../model/user.model.js';

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

  await order.populate('shopOrders.shop', 'name');
  await order.populate('shopOrders.shopOrderItems.item', 'name image price');

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
      .populate('shopOrders.owner', 'name email mobile') // Populate owner field
      .populate('shopOrders.shopOrderItems.item', 'name image price');

    const filteredOrder = orders.map(order => ({
      _id: order._id,
      user: order.user,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount,
      updatedAt: order.updatedAt,
      shopOrders: order.shopOrders.filter(
        shopOrder => shopOrder.owner._id.toString() === ownerId.toString()
      ),
    }));

    return filteredOrder;
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

//* Service for updating order status
const updateOrderStatusService = async (orderId, shopId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  const shopOrder = order.shopOrders.find(
    shopOrder => shopOrder.shop.toString() === shopId.toString()
  );

  if (!shopOrder) {
    throw new Error('Shop order not found');
  }

  shopOrder.status = status;

  let deliveryBoysPayload = [];

  if (status === 'out for delivery' && !shopOrder.assignment) {
    const { latitude, longitude } = order.deliveryAddress;

    // Get the delivery boys who are near by 5 km
    const nearByDeliveryBoys = await User.find({
      role: 'deliveryBoy',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: 5000, // 5 km
        },
      },
    });

    if (nearByDeliveryBoys.length === 0) {
      await order.save();
      throw new Error('No Delivery Boy Available');
    }

    const deliveryBoyIds = nearByDeliveryBoys.map(deliveryBoy => deliveryBoy._id);

    // Get the available delivery boy who are not assigned to any order
    const busyIds = await DeliveryAssignment.find({
      assignedTo: { $in: deliveryBoyIds },
      status: { $nin: ['broadcasted', 'completed'] },
    }).distinct('assignedTo');

    const busyIdsSet = new Set(busyIds.map(busyId => String(busyId)));

    const availableDeliveryBoys = nearByDeliveryBoys.filter(
      deliveryBoy => !busyIdsSet.has(String(deliveryBoy._id))
    );

    const candidates = availableDeliveryBoys.map(deliveryBoy => deliveryBoy._id);

    if (candidates.length === 0) {
      await order.save();
      throw new Error('No Delivery Boy Available');
    }
    const deliveryAssignment = await DeliveryAssignment.create({
      order: order._id,
      shop: shopOrder.shop,
      shopOrderId: shopOrder._id,
      brodcastedTo: candidates,
      status: 'broadcasted',
    });

    shopOrder.assignment = deliveryAssignment._id;

    shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

    await deliveryAssignment.save();

    deliveryBoysPayload = availableDeliveryBoys.map(deliveryBoy => ({
      id: deliveryBoy._id,
      fullname: deliveryBoy.fullName,
      longitude: deliveryBoy.location?.coordinates[0],
      latitude: deliveryBoy.location?.coordinates[1],
      mobile: deliveryBoy.mobile,
      email: deliveryBoy.email,
    }));
  }

  await order.save();

  const updatedShopOrder = order.shopOrders.find(so => so.shop.toString() === shopId.toString());

  await order.populate('shopOrders.shop', 'name');
  await order.populate('shopOrders.assignedDeliveryBoy', 'fullName email mobile');

  return { updatedShopOrder, deliveryBoysPayload };
};

//* Service for getting delivery boy assignment
const getDeliveryBoyAssignmentService = async deliveryBoyId => {
  const assignment = await DeliveryAssignment.find({
    brodcastedTo: deliveryBoyId,
    status: 'broadcasted',
  })
    .populate('order')
    .populate('shop');

  const formatedResponse = assignment.map(assign => ({
    assignmentId: assign._id,
    orderId: assign.order?._id,
    shopName: assign.shop.name,
    deliveryAddress: assign.order?.deliveryAddress,
    items:
      assign.order?.shopOrders.find(shop => shop._id.toString() === assign.shopOrderId.toString())
        ?.shopOrderItems || [],
    subtotal: assign.order?.shopOrders.find(
      shop => shop._id.toString() === assign.shopOrderId.toString()
    )?.subtotal,
  }));

  return formatedResponse;
};

//* Service for accepting order
const acceptOrderService = async (assignmentId, userId) => {
  const assignment = await DeliveryAssignment.findById(assignmentId);

  if (!assignment) {
    throw new Error('Delivery assignment not found.');
  }

  if (assignment.status !== 'broadcasted') {
    throw new Error('This delivery assignment has expired.');
  }

  const alreadyAssigned = await DeliveryAssignment.findOne({
    assignedTo: userId,
    status: { $nin: ['broadcasted', 'completed'] },
  });

  if (alreadyAssigned) {
    throw new Error('You already have an active order.');
  }

  assignment.assignedTo = userId;
  assignment.status = 'assigned';
  assignment.acceptedAt = new Date();

  await assignment.save();

  const order = await Order.findById(assignment.order);

  if (!order) {
    throw Error('Order not found');
  }

  const shopOrder = order.shopOrders.find(
    shopOrder => shopOrder._id.toString() === assignment.shopOrderId.toString()
  );

  if (!shopOrder) {
    throw Error('Shop order not found');
  }

  shopOrder.assignedDeliveryBoy = userId;

  await order.save();
};

//* Export services
export {
  placeOrderService,
  getOrdersService,
  updateOrderStatusService,
  getDeliveryBoyAssignmentService,
  acceptOrderService,
};
