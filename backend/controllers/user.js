const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.register = async (req, res) => {
  try {
    //req.body me se

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(404)
        .json({ success: false, message: "User already exists" });
    }
    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sampleId", url: "sampleUrl" },
    });
    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: "False",
        user,
        message: "User does not exist",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: "False",
        message: "Please enter corrcect credentials",
      });
    }
    const token = await user.generateToken();

    const options = {
      // token will expire after 90 days
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: "False",
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //agr loggedinuser phle se hi follow kr rha Usertofollow ko tb
    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(indexfollowing, 1);
      const indexfollowers = userToFollow.followers.indexOf(userToFollow._id);
      userToFollow.followers.splice(indexfollowers, 1);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(201).json({
        success: "true",
        message: "User successfully unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(201).json({
        success: "true",
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: error.message,
    });
  }
};

//UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new Password",
      });
    }
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }
    // we are not rehashing our old password because hmne ek middleware bnarkha hai user model wale folder me , jo ki jb bhi password change hota hai, toh vo save krne se phle password ko rehash krdeta hai.

    user.password = newPassword;
    await user.save();
    return res.status(400).json({
      success: true,
      message: "Password updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    //User Avatar to do
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile Updated ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
