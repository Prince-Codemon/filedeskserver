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
    const savedUser = await user.save();
    res.status(200).json({ message: "User created successfully" });
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
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (!(await comparePassword(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
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
    const id =await getId(req);
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

/**
 * It takes a token and a password, verifies the token, decodes the token, finds the user, hashes the
 * password, updates the user's password, and returns a message
 * @param req - request object
 * @param res - response object
 * @returns {
 *     "error": "Password is required"
 * }
 */
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


const accountType = async(req,res)=>{
   try {
     const id =await  getId(req)
     const user = await User.findOne({_id:id});
     if (!user) {
       return res.status(400).json({ error: "User not found", type:null });
     }
     if(user.role==='admin'){
        return res.status(200).json({ type: "admin" });
     }
     res.status(200).json({ type:'user' });
   } catch (error) {
     res.status(500).json({ error: error.message, type:'user' });
     console.log(error);
   }
}

module.exports = {
  register,
  login,
  verifyEmail,
  adminProfile,
  forgotPassword,
  resetPassword,
  accountType
};

// const { validationResult } = require("express-validator");
// const User = require("../model/User");
// const bcryptService = require("../services/bcryptService");
// const jwtService = require("../services/jwtService");

// const register = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json(errors.errors[0]);
//   }
//   const { name, email, password } = req.body;
//   try {
//     const exsist = await User.findOne({ email });
//     if (exsist) {
//       return res.status(400).json({ msg: "User already exsist" });
//     }
//     const hashPassword = await bcryptService.hashPassword(password);
//     const user = new User({
//       name,
//       email,
//       password: hashPassword,
//     });
//     await user.save();
//     return res.status(200).json({ msg: "User created successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Internal server error", err: error });
//   }
// };

// const login = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json(errors.errors[0]);
//   }
//   const { email, password } = req.body;
//   try {
//     const exists = await User.findOne({ email });
//     if (!exists) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }
//     const isMatch = await bcryptService.comparePassword(
//       password,
//       exists.password
//     );
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }
//     const token = await jwtService.generateToken(exists._id);
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Internal server error", err: error });
//   }
// };

// module.exports = {
//   register,
//   login,
// };
