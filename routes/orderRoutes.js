const getId = require("../lib/userId");
const Order = require("../model/Order");

const router = require("express").Router();

router.get("/userorders", async (req, res) => {
  try {
    const id = await getId(req);
    if (!id) {
      return res.status(400).json({ error: "User not found" });
    }
    const orders = await Order.find({
      customerId: id,
      orderPaymentStatus: {
        $ne: 0,
      },
    }).select(
      "orderStatus deliveryType orderTotal address orderItems orderAddress orderId orderPaymentId orderTotalFiles orderReceipt createdAt"
    ).sort(
      {createdAt: -1}
    )

    if (!orders) {  
      return res.status(400).json({ error: "No orders found" });
    }
    return res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

router.get("/adminorders", async (req, res) => {
  try {
    const orders = await Order.find().select(
      "orderStatus deliveryType orderTotal address orderItems orderAddress orderId orderPaymentId orderTotalFiles orderReceipt createdAt"
    ).sort(
      {createdAt: -1}
    )

    if (!orders) {
      return res.status(400).json({ error: "No orders found" });
    }
    return res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({
      orderId:id
    }).select(
      "orderStatus deliveryType orderTotal address orderItems orderAddress orderId orderPaymentId orderTotalFiles orderReceipt createdAt"
    );
      
    if (!order) {
      return res.status(400).json({ error: "No order found" });
    }
    return res.status(200).json({ order });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

router.put('/updatestatus/:id',async (req,res)=>{
    try {
      const id = req.params.id    
      const order = await Order.findOneAndUpdate({orderId:id},{$set:{orderStatus:req.body.orderStatus}})
      if(!order){
        return res.status(400).json({error:"No order found"})
      }
      return res.status(200).json({order})
    } catch (error) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
})




module.exports = router;
