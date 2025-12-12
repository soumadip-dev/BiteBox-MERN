import mongoose from 'mongoose';

//* Shop Order Item Schema
const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    price: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//* Shop Order Schema
const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'preparing', 'delivered', 'out for delivery'],
      default: 'pending',
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryAssignment',
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deliveryPasswordOtp: {
      type: String,
      default: '',
    },
    deliveryPasswordOtpExpiry: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//* Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      required: true,
    },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrders: [shopOrderSchema],
  },
  { timestamps: true }
);

//* Create the model
const Order = mongoose.model('Order', orderSchema);

//* Export the model
export default Order;
