const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
//Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Importing routes
// const post = require("./routes/post.js");
const user = require("./routes/user.js");

//Using Routes
// app.use("/api/v1", post);
app.use("/api/v1", user);
module.exports = app;
