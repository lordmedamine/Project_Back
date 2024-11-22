const express = require("express");
const {
  getAllOrders,
  getOrderById,
  addOrder,
  deleteOrder,
  updateOrder,
} = require("../Controllers/Order");

const router = express.Router();

// Route to get all orders
router.get("/", getAllOrders);

// Route to get a specific order by ID
router.get("/:_id", getOrderById);

// Route to add a new order
router.post("/", addOrder);

// Route to delete an order by ID
router.delete("/:_id", deleteOrder);

// Route to update an order by ID
router.put("/:_id", updateOrder);

module.exports = router;
