const Shop = require("../model/Shop");
const { validationResult } = require("express-validator");
const details = async (req, res) => {
  const shop = await Shop.findOne({_id :process.env.SHOP_ID});
  return res.status(200).json({ msg: shop });
};

const orderAccepting = async (req, res) => {
  const { orderAccepting } = req.body;
  const shop = await Shop.find();
  shop.orderAccepting = orderAccepting;
  await shop.save();
  return res.status(200).json({ msg: shop });
};
const editDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const {
      bwprice,
      colorprice,
      coverprice,
      bindingprice,
      spiralprice,
      orderaccepting,
    } = req.body;
    const updated = await Shop.findOneAndUpdate(
      {
        _id: process.env.SHOP_ID,
      },
      {
        bwPrice:bwprice,
        colorPrice:colorprice,
        orderAccepting:orderaccepting,
        spiralPrice:spiralprice,
        coverPrice : coverprice,
        bindingPrice:bindingprice
      }
    );

    if(!updated){
      return res.status(400).json({error:"Something went Wrong"})
    }
    return res.status(200).json({msg:'Details Edited'})
  } catch (error) {}
};
module.exports = {
  details,
  orderAccepting,
  editDetails
};
