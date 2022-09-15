const mongoose = require("mongoose");
const { Schema } = mongoose;
const addressSchema = new Schema({
  street: String,
  houseNumber: String,
  zipcode: Number,
  city: String,
  country: String,
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
