const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderAddress: {
      type: Object,
      required: true,
    },
    orderPaymentId: {
      type: String,
      default:null
    },
    orderPaymentStatus: {
      type: Number,
      required: true,
    },
    deliveryType: {
      type: String,
      required: true,
    },
    orderId:{
      type:String,
      required:true
    },
    orderReceipt:{
      type:String,
      required:true
    },
    orderTotalFiles:{
      type:Number,
      required:true
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
