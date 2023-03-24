const router = require("express").Router();
const registerSchema = require("../schema/register");
const loginSchema = require("../schema/login");
const { login, register, verifyEmail,forgotPassword, resetPassword } = require("../controllers/userController");
const {passwordSchema,emailSchema} =  require('../schema/schemas')

router.post("/register", registerSchema, register);
router.post("/login", loginSchema, login);
router.get("/verifyemail/:token", verifyEmail);
router.post("/forgotpassword",emailSchema, forgotPassword);
router.post("/resetpassword/:token", passwordSchema, resetPassword);

module.exports = router;
