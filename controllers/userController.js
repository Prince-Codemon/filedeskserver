const { validationResult } = require("express-validator");
const {
  generateToken,
  token24,
  decodeToken,
  verifyToken,
} = require("../services/jwtService");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../services/emailService");

const User = require("../model/User");
const { hashPassword, comparePassword } = require("../services/bcryptService");
const getId = require("../lib/userId");
// const getId = require("../utils/getId");

/**
 * It takes in a request and a response, validates the request, checks if the email exists, hashes the
 * password, creates a new user, saves the user, and returns a response
 * @param req - The request object.
 * @param res - the response object
 * @returns The user object is being returned.
 */
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

/**
 * It checks if the user is verified or not. If not, it sends a verification email. If yes, it
 * generates a token and sends it to the user.
 * </code>
 * @param req - The request object.
 * @param res - The response object.
 * @returns The token is being returned.
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ error: "User not Found" });
    }
    if (!(await comparePassword(password, user?.password))) {
      return res.status(400).json({ error: "Invalid password" });
    }
    //
    if (!user.verified) {
      const token = await token24(user._id);
      await sendVerificationEmail(user.email, token);
      return res.status(400).json({
        error: "We have sent you a verification email.Please verify it.",
      });
    }

    // console.log( await comparePassword(password,user.password));
    const token = await generateToken(user._id);

    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

/**
 * It verifies the token sent in the email and updates the user's isVerified field to true
 * @param req - request object
 * @param res - response object
 * @returns {
 *   "error": "Invalid token"
 * }
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log(token)
    const verify = await verifyToken(token);
    if (!verify) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const { id, exp } = await decodeToken(token);
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(400).json({ error: "Link has expired" });
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ error: "Invalid Token" });
    }
    if (user.verified) {
      return res.status(400).json({ error: "Email already verified" });
    }
    await User.findByIdAndUpdate(id, { verified: true });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * It takes the id from the request, finds the user by id, and returns the user if found, otherwise
 * returns an error.
 * @param req - request
 * @param res - response
 * @returns The user object
 */
const adminProfile = async (req, res) => {
  try {
    const id = await getId(req);
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

/**
 * It takes an email from the request body, finds the user with that email, creates a token, sends an
 * email with the token to the user, and returns a success message.
 * @param req - The request object.
 * @param res - the response object
 * @returns a promise.
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ error: "No account found on this email" });
    }
    const token = await token24(user._id);
    await sendResetPasswordEmail(user.email, token);
    return res.status(200).json({ message: "Email sent successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = await getId(req);
  console.log(id);
  const { name, profile } = req.body;
  console.log(name, profile);
  try {
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user's profile picture
    const user = await User.findByIdAndUpdate(
      id,
      { name, profile },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const verify = await verifyToken(token);
    if (!verify) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const { id, exp } = await decodeToken(token);
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(400).json({ error: "Link has expired" });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const hashedPassword = await hashPassword(password);

    const updated = await User.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    );
    if (!updated) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const accountType = async (req, res) => {
  try {
    const id = await getId(req);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ error: "User not found", type: null });
    }
    if (user.role === "admin") {
      return res.status(200).json({ type: "admin" });
    }
    res.status(200).json({ type: "user" });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "user" });
    console.log(error);
  }
};
const addNewAddress = async (req, res) => {
  try {
    const id = await getId(req);
    const { values } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    user.address.push(values);
    await user.save();
    res.status(200).json({ message: "New address added" }, user.address);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const id = await getId(req);
    const { addressId } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the address to be deleted
    const addressIndex = user.address.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Remove the address from the user's address array
    user.address.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// _________ Google Login ___________
const googleLogin = async (req, res) => {
  const { email_verified, name, clientId, email, picture } = req.body;
  try {
    if (email_verified) {
      const user = await User.findOne({ email });
      if (user) {
        if (!user.verified) {
          user.verified = true;
          await user.save();
        }

        return res.status(200).json({
          message: "User logged in successfully",
          user: user,
          token: await generateToken(user._id),
        });
      } else {
        const password = email + clientId;
        const hashedPassword = await hashPassword(password);

        const user = new User({
          name,
          email,
          password: hashedPassword,
          profile: picture,
          verified: true,
        });

        await user.save();
        return res.status(200).json({
          message: "User logged in successfully",
          user: user,
          token: await generateToken(user._id),
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = {
  register,
  login,
  verifyEmail,
  adminProfile,
  forgotPassword,
  resetPassword,
  accountType,
  googleLogin,
  updateUser,
};
