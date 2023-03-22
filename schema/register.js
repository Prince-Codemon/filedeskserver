const { body } = require("express-validator");

const registerSchema = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
  .not().isEmpty().withMessage(
    "Email is required"
  ).isEmail().withMessage("Please enter a valid email address"),
  body("password")
  .not()
  .isEmpty()
  .withMessage(
    "Password is required"
  )
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)
    .withMessage(
      "Password must contain at least one uppercase, one lowercase, one number and one special case character"
    ),
];


module.exports = registerSchema;

