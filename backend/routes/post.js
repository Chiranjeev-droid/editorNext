const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
} = require("../controllers/post");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router
  .route("/post/:id")
  .post(isAuthenticated, likeAndUnlikePost)
  .delete(isAuthenticated, deletePost);
router.route("/posts").get(isAuthenticated, getPostOfFollowing);
module.exports = router;
