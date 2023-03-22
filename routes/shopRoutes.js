const router = require("express").Router();
const {details, orderAccepting} = require('../controllers/shopController')


router.get("/details", details);
router.post("/orderAccepting", orderAccepting);

module.exports = router;
