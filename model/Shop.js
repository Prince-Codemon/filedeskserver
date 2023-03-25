const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  bwSingle: {
    type: Number,
    required: true,
  },
  bwDouble: {
    type: Number,
    required: true,
  },
  colorPrice: {
    type: Number,
    required: true,
  },
  spiralPrice: {
    type: Number,
    required: true,
  },
  coverPrice: {
    type: Number,
    required: true,
  },
  deliveryPrice: {
    type: Number,
    required: true,
  },
  fastDeliveryPrice:{
    type: Number,
    required: true,
  },
  
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
orderAccepting:{
    type: Boolean,
    required: true,
    default: true
}
},{
    timestamps: true
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;

