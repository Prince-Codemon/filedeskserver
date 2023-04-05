const Shop = require("../model/Shop");
const { validationResult } = require("express-validator");
const details = async (req, res) => {
  const shop = await Shop.findOne({ _id: process.env.SHOP_ID });
  return res.status(200).json({ msg: shop });
};

// const orderAccepting = async (req, res) => {
//   const { orderAccepting } = req.body;
//   const shop = await Shop.find();
//   shop.orderAccepting = orderAccepting;
//   await shop.save();
//   return res.status(200).json({ msg: shop });
// };
const editDetails = async (req, res) => {
  try {
    // console.log(req.body); 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const {
      bwSingle,
      bwDouble,
      colorPrice,
      coverPrice,
      spiralPrice,
      orderAccepting,
      deliveryPrice,
      fastDeliveryPrice,
    } = req.body;
    const updated = await Shop.findOneAndUpdate(
      {
        _id: process.env.SHOP_ID,
      },
      {
        bwSingle,
        bwDouble,
        colorPrice,
        coverPrice,
        spiralPrice,
        orderAccepting,
        deliveryPrice,
        fastDeliveryPrice,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ error: "Something went Wrong" });
    }

    return res.status(200).json({ msg: "Details Edited", shop: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  details,
  // orderAccepting,
  editDetails,
};
