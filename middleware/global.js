const global = async (req, res, next) => {
  const secretKey = req.headers["secret-key"];
  if (secretKey === process.env.GLOBAL_KEY) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = global;
