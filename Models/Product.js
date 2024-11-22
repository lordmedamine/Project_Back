// pour la base de donnee
const mongoose = require("mongoose");

//creation du schema ( structure du base de donnee)
const schema = mongoose.Schema;

const product = new schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", product);
