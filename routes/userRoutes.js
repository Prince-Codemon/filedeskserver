const router = require("express").Router();
const registerSchema = require("../schema/register");
const loginSchema = require("../schema/login");
const {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  accountType,
  googleLogin,
  adminProfile,
  updateUser,
} = require("../controllers/userController");
const { passwordSchema, emailSchema } = require("../schema/schemas");
const user = require("../middleware/user");

router.post("/register", registerSchema, register);
router.post("/login", loginSchema, login);
router.post("/google", googleLogin);
router.get("/verifyemail/:token", verifyEmail);
router.post("/forgotpassword", emailSchema, forgotPassword);
router.post("/resetpassword/:token", passwordSchema, resetPassword);
router.get("/accounttype", user, accountType);
router.get("/profile", user, adminProfile);
router.post("/profile/update",user, updateUser);


module.exports = router;
