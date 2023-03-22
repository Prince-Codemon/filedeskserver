// const jwt = require('jsonwebtoken');

// const generateToken = async(id) => {
//     return await jwt.sign({id}, process.env.JWT_SECRET, {
//         expiresIn: '15d'
//     })
// }

// const verifyToken = async (token)=>{
//     return await jwt.verify(token, process.env.JWT_SECRET)
// }

// module.exports = {generateToken, verifyToken}
const Jwt = require("jsonwebtoken");

const generateToken = async (payload) => {
  return await Jwt.sign(
    {
      _id: payload._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const verifyToken = async (token) => {
  if (
    token === null ||
    token === "undefined" ||
    token === "null" ||
    token === "NaN"
  ) {
    return false;
  }
  if (token.length < 150) {
    return false;
  }

  const verify = await Jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err) => {
      if (err) {
        return false;
      }
      return true;
    }
  );

  if (!verify) {
    return false;
  }
  return true;
};

const token24 = async (id) => {
  return await Jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
const decodeToken = async (token) => {
  return await Jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  token24,
  decodeToken,
};
