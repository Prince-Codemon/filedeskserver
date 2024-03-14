const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const helmet = require("helmet");
const global = require("./middleware/global");
const user = require("./middleware/user");
const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  }
});

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

db();

app.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

io.on("connection", (socket) => {
  // console.log("A client connected");

  
  // // Handle disconnection
  // socket.on("disconnect", () => {
  //   console.log("A client disconnected");
  // });
});

module.exports = io

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/shop", global, require("./routes/shopRoutes"));
app.use("/file", global, require("./routes/pdfRouter"));
app.use("/api", user, require("./routes/orderRoutes"));

server.listen(PORT, () =>
  console.log(`Listening on => http://localhost:`,PORT)
);

