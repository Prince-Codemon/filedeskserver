const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
// const path = require("path");
const helmet = require("helmet");
const global = require("./middleware/global");
const user = require("./middleware/user");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.resolve("uploads")));

db();

app.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

app.use("/api/user", global, require("./routes/userRoutes"));
app.use("/api/shop", global, require("./routes/shopRoutes"));
app.use("/file",global, require("./routes/pdfRouter"));
app.use("/api",global, user, require("./routes/orderRoutes"));

app.listen(PORT, () => console.log(`Listening on => http://localhost:`, PORT));
