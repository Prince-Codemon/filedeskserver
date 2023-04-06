const Shop = require("../model/Shop");
const { validationResult } = require("express-validator");
/**
 * This function retrieves details of a shop with a specific ID and returns it as a JSON response.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request such as the request method, headers, URL, and any data that was sent with the request.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the `http.ServerResponse` class in Node.js. The `res` object has methods like
 * `res.status()` and `res.json()` that are used to set the HTTP status
 * @returns The `details` function is returning a JSON response with a status code of 200 and a message
 * containing the details of a shop object that was found using its ID. If the shop is not found, the
 * function returns a JSON response with a status code of 400 and an error message.
 */
const details = async (req, res) => {
  const shop = await Shop.findOne({ _id: process.env.SHOP_ID });
  if(!shop){
    return res.status(400).json({ error: "Shop not found" });
  }

  return res.status(200).json({ msg: shop });
};

/**
 * This function updates the details of a shop and returns a success message or an error message.
 * @param req - req is an object that represents the HTTP request made by the client to the server. It
 * contains information such as the request method, headers, URL, and any data sent in the request
 * body.
 * @param res - `res` is the response object that is sent back to the client making the request. It
 * contains information such as the status code, headers, and data that is being sent back. In this
 * case, the response is being used to send back JSON data with a status code and a message or error
 * @returns The function `editDetails` returns a JSON response with a status code and a message or
 * error message, depending on the outcome of the function. If the function is successful, it returns a
 * 200 status code with a message "Details Edited" and the updated shop object. If there are validation
 * errors, it returns a 400 status code with an error message. If there is an error during the
 */
const editDetails = async (req, res) => {
  try {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const {
      bwSingle,
      bwDouble,
      colorPrice,
      coverPrice,
      spiralPrice,
      orderAccepting,
      deliveryPrice,
      fastDeliveryPrice,
    } = req.body;
    const updated = await Shop.findOneAndUpdate(
      {
        _id: process.env.SHOP_ID,
      },
      {
        bwSingle,
        bwDouble,
        colorPrice,
        coverPrice,
        spiralPrice,
        orderAccepting,
        deliveryPrice,
        fastDeliveryPrice,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(400).json({ error: "Something went Wrong" });
    }
    return res.status(200).json({ msg: "Details Edited", shop: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  details,
  // orderAccepting,
  editDetails,
};
