const { verifyToken, decodeToken } = require("../services/jwtService");
const User = require("../model/User");
const admin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Invalid Auth" });
  }
  const verify = await verifyToken(token);
  if (!verify) {
    return res.status(400).json({ error: "Invalid Auth" });
  }
  const id = await decodeToken(token);
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(400).json({ error: "Invalid Auth" });
  }
  if (user.role !== "admin") {
    return res.status(400).json({ error: "Invalid Auth" });
  }
  next();
};
