const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //   folder: "posts",
    // });
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "myCloud.public_id",
        url: "myCloud.secure_url",
      },
      owner: req.user._id,
    };

    const post = await Post.create(newPostData);

    const user = await User.findById(req.user._id);

    user.posts.unshift(post._id);

    await user.save();
    res.status(201).json({
      success: true,
      message: "Post created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found...",
      });
    }
    //agr post already liked hai
    if (post.likes.includes(req.user._id)) {
      //agr vo already liked hai toh index dhudenge, ye idex return krdega jha bhi user ki id match ho jaati hai
      const index = post.likes.indexOf(req.user._id);
      //start kha se krna hai , kitne delete krne hai
      post.likes.splice(index, 1);

      await post.save();
      res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      //agr post already liked nhi hai toh
      post.likes.push(req.user._id);
      await post.save();
      res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};
