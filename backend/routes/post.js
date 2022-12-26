const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { createPost, likeAndUnlikePost } = require("../controllers/post");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id").post(isAuthenticated, likeAndUnlikePost);

module.exports = router;
