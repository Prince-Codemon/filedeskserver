const jwt = require("jsonwebtoken");
const getId = async (req) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return null;
  }
  const decoded = await jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decode) => {
      if (err) {
        return null;
      }
      return decode;
    }
  );
  if (!decoded) {
    return null;
  }
  if (decoded.exp && decoded.exp < Date.now() / 1000) {
    return null;
  }
  const id = decoded._id;
  return id;
};

module.exports = getId;
