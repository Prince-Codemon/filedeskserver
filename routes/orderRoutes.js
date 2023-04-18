const { updateStatus, getOrder, adminOrders, userOrders, verifyOrder, createOrder, deleteOrder } = require("../controllers/orderController");
const admin = require("../middleware/admin");
const router = require("express").Router();

router.get("/userorders",userOrders );
router.get("/adminorders", admin, adminOrders);
router.get("/order/:id",getOrder);
router.put('/updatestatus/:id', admin,updateStatus)
router.post("/createorder", createOrder);
router.post("/verifyorder", verifyOrder);
router.put('/deleteorder/:id',admin,deleteOrder)

module.exports = router;
    