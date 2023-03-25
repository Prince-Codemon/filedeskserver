const { body } = require("express-validator");

const shopSchema = [
  body("orderAccepting")
    .exists()
    .withMessage("Order accepting is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Order accepting is required")
    .isBoolean()
    .withMessage("Order accepting must be a boolean value"),
  body("bwSingle")
    .exists()
    .withMessage("Black and white single price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Black and white single price is required")
    .isNumeric()
    .withMessage("Black and white single price must be a number"),
  body("bwDouble")
    .exists()
    .withMessage("Black and white double price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Black and white double price is required")
    .isNumeric()
    .withMessage("Black and white double price must be a number"),

  body("colorPrice")
    .exists()
    .withMessage("Color price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Color price is required")
    .isNumeric()
    .withMessage("Color price must be a number"),
  body("coverPrice")
    .exists()
    .withMessage("Cover price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Cover price is required")
    .isNumeric()
    .withMessage("Cover price must be a number"),
  
  body("deliveryPrice")
    .exists()
    .withMessage("Delivery price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Delivery price is required")
    .isNumeric()
    .withMessage("Delivery price must be a number"),
  body("spiralPrice")
    .exists()
    .withMessage("Spiral price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Spiral price is required")
    .isNumeric()
    .withMessage("Spiral price must be a number"),
  body("fastDeliveryPrice")
    .exists()
    .withMessage("Fast delivery price is required")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Fast delivery price is required")
    .isNumeric()
    .withMessage("Fast delivery price must be a number"),
    
  // body('owner')
  // .exists()
  // .withMessage('Owner is required')
  // .trim()
  // .not()
  // .isEmpty()
  // .withMessage('Owner is required')
  // .isMongoId()
  // .withMessage('Owner must be a valid mongo id')
];


module.exports = shopSchema;