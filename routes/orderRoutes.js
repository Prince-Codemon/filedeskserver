const { updateStatus, getOrder, adminOrders, userOrders, verifyOrder, createOrder } = require("../controllers/orderController");
const admin = require("../middleware/admin");
const router = require("express").Router();

router.get("/userorders",userOrders );
router.get("/adminorders", admin, adminOrders);
router.get("/order/:id",getOrder);
router.put('/updatestatus/:id', admin,updateStatus)
router.post("/createorder", createOrder);
router.post("/verifyorder", verifyOrder);

module.exports = router;
    