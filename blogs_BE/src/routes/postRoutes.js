const express = require("express");
const Post = require("../models/post");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

// get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Server error while fetching posts");
  }
});

//get posts of logged in user
router.get("/myposts", userAuth, async (req, res) => {
  try {
    const post = await Post.find({ authorId: req.user._id }).populate(
      "authorId",
      "name email"
    );
    if (!post) {
      return res.status(404).send("No posts found for this user");
    }
    res.json(post);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error while fetching posts");
  }
});

//get post by id
router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate("authorId", "name email");
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).send("Error while fetching post");
  }
});

// create new post
router.post("/", userAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send("Title and content are required");
    }

    const newPost = new Post({
      title,
      content,
      authorId: req.user._id,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Error while creating post");
  }
});

// update post
router.put("/:id", userAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized to update this post");
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Error while updating post");
  }
});

// delete post
router.delete("/:id", userAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    // Ownership check
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized to delete this post");
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Error while deleting post");
  }
});

module.exports = router;
