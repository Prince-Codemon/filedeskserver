const router = require("express").Router();
const {details, editDetails} = require('../controllers/shopController');
const admin = require("../middleware/admin");
const user = require("../middleware/user");
const shopSchema = require("../schema/shopSchema");

router.get("/details", details);
router.put("/editdetails",shopSchema, user, admin, editDetails)

module.exports = router;
