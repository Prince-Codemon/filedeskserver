const Order = require("../model/Order");
const Shop = require("../model/Shop");
const User = require("../model/User");
const crypto = require("crypto");
const getId = require("../lib/userId");
const Razorpay = require("razorpay");
const { deleteFile } = require("../services/imageService");
const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const orderID = `ORDERID_${razorpay_order_id?.split("_")[1]}`;
    // console.log(orderID);
    const order = await Order.findOne({
      orderId: orderID,
    });
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }
    if (order.orderPaymentStatus === 1) {
      return res.status(400).json({ error: "Payment already done" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_ID)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      const updateOrder = await Order.findOneAndUpdate(
        {
          orderId: orderID,
        },
        {
          orderPaymentStatus: 1,
          orderPaymentId: razorpay_payment_id,
        },
        {
          new: true,
        }
      );
      if (!updateOrder) {
        return res.status(500).json({ error: "something went wrong!" });
      }

      return res.status(200).json({ data: "Payment Successful" });
    }
    return res.status(400).json({ error: "Payment Failed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong!" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { totalPrice, delivery, data, address, totalFiles } = req.body;

    // console.log(req.body);
    const shop = await Shop.findOne({
      _id: process.env.SHOP_ID,
    });

    // console.log(shop);
    if (!totalPrice) {
      return res.status(400).json({ error: "Total price is required" });
    }
    if (!delivery) {
      return res.status(400).json({ error: "Delivery is required" });
    }
    if (!data) {
      return res.status(400).json({ error: "Files is required" });
    }
    if (totalPrice < 50) {
      return res
        .status(400)
        .json({ error: "Total price should be greater than 50" });
    }
    if (data.length < 1) {
      return res.status(400).json({ error: "Atleast one file is required" });
    }
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }
    if (!totalFiles) {
      return res.status(400).json({ error: "Total files are required" });
    }
    if (totalFiles !== data.length) {
      return res.status(400).json({ error: "Total files is not correct" });
    }
    let price = delivery.standard ? shop.deliveryPrice : shop.fastDeliveryPrice;
    data.forEach((item) => {
      price = price + item.price;
    });
    if (price != totalPrice) {
      return res.status(400).json({ error: "Total Price is not correct" });
    }
    const id = await getId(req);
    if (!id) {
      return res.status(400).json({ error: "User not found" });
    }
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_ID,
    });
    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      payment_capture: 1,
      notes: {
        name: user.name,
        email: user.email,
        phone: address.phone,
        address: address.address,
        totalFiles,
        deliveryType: delivery?.standard ? "standard" : "fast",
      },
    };

    instance.orders.create(options, async (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "something went wrong!" });
      }
      const orderID = `ORDERID_${order?.id.split("_")[1]}`;
      // console.log(orderID);
      const createOrder = await Order.create({
        customerId: id,
        orderId: orderID,
        orderStatus: 0,
        orderReceipt: order.receipt,
        orderTotal: order.amount / 100,
        orderPaymentStatus: 0,
        orderItems: data,
        orderAddress: address,
        orderTotalFiles: totalFiles,
        deliveryType: delivery?.standard ? "standard" : "fast",
      });
      if (!createOrder) {
        return res.status(500).json({ error: "something went wrong!" });
      }
      // console.log("createorder", createOrder);
      // console.log("order", order);
      return res.status(200).json({
        data: order,
        user: {
          name: user.name,
          email: user.email,
          phone: address.phone,
          address: address.address,
        },
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong!" });
  }
};

const userOrders = async (req, res) => {
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
    })
      .select(
        "orderStatus deliveryType orderTotal address orderItems orderAddress orderId orderPaymentId orderTotalFiles orderReceipt createdAt"
      )
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(400).json({ error: "No orders found" });
    }
    return res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const adminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select(
        "orderStatus deliveryType orderTotal address orderItems orderAddress orderId orderPaymentId orderTotalFiles orderReceipt createdAt"
      )
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(400).json({ error: "No orders found" });
    }
    return res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const getOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({
      orderId: id,
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
};

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOneAndUpdate(
      { orderId: id },
      { $set: { orderStatus: req.body.orderStatus } }
    );
    if (!order) {
      return res.status(400).json({ error: "No order found" });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const findOrder = await Order.findOne({
      orderId: id,
    });
    if (!findOrder) {
      return res.status(400).json({ error: "No order found" });
    } 
    await findOrder.orderItems?.map(async (findOrderItem) => {
      await deleteFile(findOrderItem?.file);
    });
    const deleteOrder = await Order.deleteOne({
      orderId: id,
    });
    if (!deleteOrder) {
      return res.status(400).json({ error: "No order found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong!" });
  }
};

module.exports = {
  verifyOrder,
  createOrder,
  userOrders,
  adminOrders,
  getOrder,
  updateStatus,
  deleteOrder,
};
