const Order = require("../Models/Order");
const User = require("../Models/User");
const Product = require("../Models/Product");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    /* .populate("user", "username email")
      .populate("items.product", "name price imgURL"); */

    res.status(200).json({ msg: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ msg: "Error fetching orders", error });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { _id } = req.params;
    const order = await Order.findById(_id);
    /*     .populate("user", "username email")
      .populate("items.product", "name price imgURL"); */

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ msg: "Order fetched successfully", order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ msg: "Error fetching order by ID", error });
  }
};

// Add a new order
exports.addOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, paymentMethod } = req.body;

    // Validate shippingAddress and paymentMethod
    if (!shippingAddress || !paymentMethod) {
      return res
        .status(400)
        .json({ msg: "Shipping address and payment method are required" });
    }

    // Check if user exists
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Validate product IDs in items
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ msg: `Product not found: ${item.product}` });
      }
      item.price = product.price; // Ensure price matches the product's price
      item.totalPrice = item.price * item.quantity; // Calculate total price
    }

    // Calculate total amount
    const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);

    const newOrder = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({ msg: "Order added successfully", newOrder });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ msg: "Error adding order", error });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ msg: "Order updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ msg: "Error updating order", error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(_id);

    if (!deletedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ msg: "Error deleting order", error });
  }
};
