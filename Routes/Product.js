const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../Controllers/Products");

const router = express.Router();

// Route to add a new product
router.post("/", addProduct);

// Route to get all products
router.get("/", getProducts);

// Route to get a specific product by ID
router.get("/:_id", getProductById);

// Route to delete a product by ID
router.delete("/:_id", deleteProduct);

// Route to update a product by ID
router.put("/:_id", updateProduct);

module.exports = router;
