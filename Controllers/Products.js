const Product = require("../Models/Product");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, imgURL } = req.body;

    if (!name || name.length < 5) {
      return res
        .status(400)
        .send({ msg: "Name must be at least 5 characters long" });
    }

    const product = new Product({ name, price, description, imgURL });
    await product.save();

    res.status(200).send({ msg: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ msg: "Error adding product", error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({ msg: "Products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ msg: "Error fetching products", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }

    res.status(200).send({ msg: "Product fetched successfully", product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).send({ msg: "Error fetching product by ID", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return res.status(404).send({ msg: "Product not found" });
    }

    res
      .status(200)
      .send({ msg: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ msg: "Error deleting product", error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const { price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { $set: { price } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ msg: "Product not found" });
    }

    res
      .status(200)
      .send({ msg: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ msg: "Error updating product", error });
  }
};
