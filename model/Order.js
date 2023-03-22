const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderDate: {
      type: Date,
      required: true,
    },
    orderStatus: {
      type: Number,
      default: 0,
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    orderItems: {
      type: Array,
      required: true,
    },
    orderCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderAddress: {
      type: String,
      required: true,
    },
    orderPhone: {
      type: Number,
      required: true,
    },
    orderPayment: {
      type: String,
      required: true,
    },
    orderPaymentId: {
      type: String,
      required: true,
    },
    delivery: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
