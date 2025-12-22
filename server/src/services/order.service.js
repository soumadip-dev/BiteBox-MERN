import DeliveryAssignment from '../model/deliveryAssignment.model.js';
import Order from '../model/order.model.js';
import Shop from '../model/shop.model.js';
import User from '../model/user.model.js';
import razorpayInstance from '../config/razorpay.config.js';
import { ENV } from '../config/env.config.js';

//* Helper function to emit order to owner
const emitOrderToOwner = (io, order, eventName = 'newOrder') => {
  if (!io) return;

  order.shopOrders.forEach(shopOrder => {
    const ownerSocketId = shopOrder.owner?.socketId;
    if (ownerSocketId) {
      io.to(ownerSocketId).emit(eventName, {
        _id: order._id,
        user: order.user,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        totalAmount: order.totalAmount,
        updatedAt: order.updatedAt,
        payment: order.payment, // Include payment status
        shopOrders: shopOrder, // Single shopOrder for this owner
      });
    }
  });
};

//* Service for placing Order
const placeOrderService = async (
  cartItems,
  paymentMethod,
  deliveryAddress,
  totalAmount,
  userId,
  req
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

  if (paymentMethod === 'online') {
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    });
    const newOrder = await Order.create({
      user: userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
      razorpayOrderId: razorpayOrder.id,
      payment: false,
    });

    const returnResponse = {
      razorpayOrder,
      orderId: newOrder._id,
      key_id: ENV.RAZORPAY_KEY_ID,
    };

    return returnResponse;
  }

  const newOrder = await Order.create({
    user: userId,
    paymentMethod,
    deliveryAddress,
    totalAmount,
    shopOrders,
  });

  await newOrder.populate('shopOrders.shop', 'name');
  await newOrder.populate('shopOrders.owner', 'name socketId');
  await newOrder.populate('user', 'name email mobile');
  await newOrder.populate('shopOrders.shopOrderItems.item', 'name image price');

  const io = req.app.get('io');

  // Emit new order to all shop owners
  if (io) {
    emitOrderToOwner(io, newOrder, 'newOrder');
  }
  return newOrder;
};

//* Service for verifying payment
const verifyPaymentService = async (OrderId, razorpayPaymentId, req) => {
  const payment = await razorpayInstance.payments.fetch(razorpayPaymentId);
  if (!payment || payment.status !== 'captured') {
    throw new Error('Payment Failed');
  }
  const order = await Order.findById(OrderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.payment = true;
  order.razorpayPaymentId = razorpayPaymentId;
  await order.save();

  await order.populate('shopOrders.shop', 'name');
  await order.populate('shopOrders.shopOrderItems.item', 'name image price');
  await order.populate('user', 'name email mobile');
  await order.populate('shopOrders.owner', 'name socketId');

  const io = req.app.get('io');

  // Emit new order to all shop owners after payment verification
  if (io) {
    emitOrderToOwner(io, order, 'newOrder');
  }

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
      .populate('shopOrders.owner', 'name email mobile')
      .populate('shopOrders.shopOrderItems.item', 'name image price')
      .populate('shopOrders.assignedDeliveryBoy', 'fullName mobile');

    const filteredOrder = orders.map(order => ({
      _id: order._id,
      user: order.user,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount,
      updatedAt: order.updatedAt,
      payment: order.payment,
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
const updateOrderStatusService = async (orderId, shopId, status, req) => {
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
      isOnline: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: 5000,
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

    await deliveryAssignment.populate('order');
    await deliveryAssignment.populate('shop');

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

    const io = req.app.get('io');
    if (io) {
      availableDeliveryBoys.forEach(deliveryBoy => {
        const deliveryBoySocketId = deliveryBoy.socketId;
        if (deliveryBoySocketId) {
          io.to(deliveryBoySocketId).emit('newOrderAssignment', {
            assignmentId: deliveryAssignment._id,
            sentTo: deliveryBoy._id,
            orderId: deliveryAssignment.order?._id,
            shopName: deliveryAssignment.shop.name,
            deliveryAddress: deliveryAssignment.order?.deliveryAddress,
            items:
              deliveryAssignment.order?.shopOrders.find(
                shop => shop._id.toString() === deliveryAssignment.shopOrderId.toString()
              )?.shopOrderItems || [],
            subtotal: deliveryAssignment.order?.shopOrders.find(
              shop => shop._id.toString() === deliveryAssignment.shopOrderId.toString()
            )?.subtotal,
          });
        }
      });
    }
  }

  await order.save();

  const updatedShopOrder = order.shopOrders.find(so => so.shop.toString() === shopId.toString());

  await order.populate('shopOrders.shop', 'name');
  await order.populate('shopOrders.assignedDeliveryBoy', 'fullName email mobile');
  await order.populate('user', 'socketId');

  const io = req.app.get('io');

  if (io) {
    io.to(order.user.socketId).emit('updateOrderStatus', {
      orderId: order._id,
      shopId: updatedShopOrder.shop._id,
      status: updatedShopOrder.status,
      userId: order.user._id,
    });
  }
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

  const shopOrder = order.shopOrders.id(assignment.shopOrderId);

  if (!shopOrder) {
    throw Error('Shop order not found');
  }

  shopOrder.assignedDeliveryBoy = userId;

  await order.save();
};

//* Service for getting current order
const getCurrentOrderService = async (userId, userRole) => {
  if (!userId || userRole.toString() !== 'deliveryBoy') {
    throw new Error('Invalid user role');
  }

  const assignment = await DeliveryAssignment.findOne({
    assignedTo: userId,
    status: 'assigned',
  })
    .populate('assignedTo', 'fullName email mobile location')
    .populate('shop', 'name')
    .populate({
      path: 'order',
      populate: [
        { path: 'user', select: 'fullName email mobile location' },
        {
          path: 'shopOrders.shop',
          select: 'name address',
        },
      ],
    });

  if (!assignment) {
    throw new Error('No active order found.');
  }

  if (!assignment.order) {
    throw new Error('Order not found');
  }

  const shopOrder = assignment.order.shopOrders.find(
    shopOrder => shopOrder._id.toString() === assignment.shopOrderId.toString()
  );

  if (!shopOrder) {
    throw new Error('Shop order not found');
  }

  let deliveryBoyLocation = { lat: null, lon: null };

  if (assignment.assignedTo.location) {
    deliveryBoyLocation = {
      lat: assignment.assignedTo.location.coordinates[1],
      lon: assignment.assignedTo.location.coordinates[0],
    };
  }

  let customerLocation = { lat: null, lon: null };

  if (assignment.order.deliveryAddress) {
    customerLocation = {
      lat: assignment.order.deliveryAddress.latitude,
      lon: assignment.order.deliveryAddress.longitude,
    };
  }
  return {
    _id: assignment.order._id,
    user: assignment.order.user,
    shopOrder,
    deliveryAddress: assignment.order.deliveryAddress,
    deliveryBoyLocation,
    customerLocation,
  };
};

//* Service for getting order by id
const getOrderByIdService = async orderId => {
  try {
    const order = await Order.findById(orderId)
      .populate('user')
      .populate({
        path: 'shopOrders.shop',
        select: 'name image address',
      })
      .populate({
        path: 'shopOrders.assignedDeliveryBoy',
        model: 'User',
      })
      .populate({
        path: 'shopOrders.shopOrderItems',
        model: 'ShopOrderItem',
      })
      .lean();

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    throw new Error('Error fetching order');
  }
};

//* Service for sending OTP to user
const sendDeliveryBoyOtpService = async (orderId, shopOrderId, userId) => {
  const order = await Order.findById(orderId).populate('user');

  const shopOrder = order.shopOrders.id(shopOrderId);

  if (!order || !shopOrder) {
    throw new Error('Order not found');
  }
  // Generate OTP
  const generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  const customerName = order.user.fullName;
  const customerEmail = order.user.email;

  shopOrder.deliveryPasswordOtp = generatedOTP;
  shopOrder.deliveryPasswordOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  await order.save();

  return { customerName, customerEmail, generatedOTP };
};

//* Service for verifying OTP
const verifyDeliveryBoyOtpService = async (orderId, shopOrderId, otp) => {
  const order = await Order.findById(orderId).populate('user');

  const shopOrder = order.shopOrders.id(shopOrderId);

  if (!order || !shopOrder) {
    throw new Error('Order not found');
  }

  if (
    shopOrder.deliveryPasswordOtp !== otp ||
    !shopOrder.deliveryPasswordOtpExpiry ||
    shopOrder.deliveryPasswordOtpExpiry < Date.now()
  ) {
    throw new Error('Invalid or Expired OTP');
  }

  shopOrder.status = 'delivered';
  shopOrder.deliveredAt = Date.now();
  shopOrder.deliveryPasswordOtp = '';
  shopOrder.deliveryPasswordOtpExpiry = 0;

  await order.save();

  await DeliveryAssignment.deleteOne({
    shopOrderId: shopOrder._id,
    order: order._id,
    assignedTo: shopOrder.assignedDeliveryBoy,
  });
};

//* Service for getting today's deliveries
const getTodayDeliveriesService = async (deliveryBoyId, startsOfDay) => {
  const orders = await Order.find({
    shopOrders: {
      $elemMatch: {
        assignedDeliveryBoy: deliveryBoyId,
        status: 'delivered',
        deliveredAt: { $gte: startsOfDay },
      },
    },
  }).lean();

  let todaysDeliveries = [];
  orders.forEach(order => {
    order.shopOrders.forEach(shopOrder => {
      if (
        shopOrder.assignedDeliveryBoy &&
        shopOrder.assignedDeliveryBoy.toString() === deliveryBoyId &&
        shopOrder.status === 'delivered' &&
        shopOrder.deliveredAt &&
        shopOrder.deliveredAt >= startsOfDay
      ) {
        todaysDeliveries.push(shopOrder);
      }
    });
  });

  let stats = {};

  todaysDeliveries.forEach(shopOrder => {
    const hour = new Date(shopOrder.deliveredAt).getHours();
    stats[hour] = (stats[hour] || 0) + 1;
  });

  let formatedStats = Object.keys(stats).map(hour => ({
    hour: parseInt(hour),
    count: stats[hour],
  }));

  formatedStats.sort((a, b) => a.hour - b.hour);

  return formatedStats;
};

//* Export services
export {
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
  getTodayDeliveriesService,
};
