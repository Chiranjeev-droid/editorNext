const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies; // token le liya cookies me se
  // console.log(token);
  // console.log(req.cookies.token);
  if (!token) {
    return res.status(401).json({
      success: "false",
      message: "Please login/register first",
    });
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // bs ye kra hai ki req.user me user ka data save krliya hai agr user logged in tha toh
  req.user = await User.findById(decoded._id);

  next();
};
