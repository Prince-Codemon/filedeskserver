const router = require("express").Router();
const registerSchema = require("../schema/register");
const loginSchema = require("../schema/login");
const { login, register } = require("../controllers/userController");

router.post("/register", registerSchema, register);
router.post("/login", loginSchema, login);

module.exports = router;
