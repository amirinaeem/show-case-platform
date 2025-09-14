import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import { env } from '../../env.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    billingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    totalPrice,
    deliveryMethod,
  } = req.body;

  // Validate order items
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Validate each order item
    for (const item of orderItems) {
      if (!item.name || !item.price || !item.licenseType || !item._id) {
        res.status(400);
        throw new Error('Invalid order items');
      }
    }

    // Create the order
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        application: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      billingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      deliveryMethod,
    });

    // Save the order
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

// @desc    Get PayPal Client ID
// @route   GET /api/config/paypal
// @access  Public
const getPayPalClientId = asyncHandler(async (req, res) => {
  try {
    // Fetch PayPal Client ID from environment variables
    const paypalClientId = env.PAYPAL_CLIENT_ID;

    if (!paypalClientId) {
      res.status(500);
      throw new Error('PayPal Client ID not configured');
    }

    // Return the PayPal Client ID
    res.status(200).json({ clientId: paypalClientId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getPayPalClientId,
};