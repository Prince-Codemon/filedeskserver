const router = require("express").Router();
const {details, editDetails} = require('../controllers/shopController');
const shopSchema = require("../schema/shopSchema");


router.get("/details", details);
// router.post("/orderaccepting", orderAccepting);
router.put("/editdetails",shopSchema, editDetails)

module.exports = router;
