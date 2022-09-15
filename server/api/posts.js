const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

const auth = require("../middlewares/auth");

//--------------Add AUTH middleware alter!!!!!!!!!!-------------------

router.post("/add", async (req, res) => {
  try {
    const newPost = new Post(req.body);

    const post = await newPost
      .save()
      .then((item) =>
        item.populate({ path: "owner", select: "firstName lastName email" })
      );

    if (!post) return res.send({ success: false, errorId: 2 });

    res.send({ success: true, post });
  } catch (error) {
    console.log("Posts add ERROR", error.message);
    res.send(error.message);
  }
});
//--------------Add AUTH middleware alter!!!!!!!!!!-------------------
router.get("/list/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const posts = await Post.find({ owner: userid }).populate({
      path: "owner",
      select: "email",
    });

    res.send({ success: true, posts });
  } catch (error) {
    console.log("Posts list ERROR", error.message);
    res.send(error.message);
  }
});
/* --------DELETE POST---------- */
router.delete("/delete/:userid/:postid", async (req, res) => {
  const { userid, postid } = req.params;

  try {
    const postToDelete = await Post.findByIdAndDelete(postid);
    // 1. get the post
    const posts = await Post.find({ owner: userid }).populate({
      path: "owner",
      select: "firstName lastName email",
    });

    res.send({ success: true, userPosts });
  } catch (error) {
    console.log("Posts Delete ERROR", error.message);
    res.send(error.message);
  }
});

/* --------UPDATE POST---------- */
router.put("/update/:userid/:postid", async (req, res) => {
  const { userid, postid } = req.params;

  try {
    const postToUpdate = await Post.findByIdAndUpdate(postid, req.body, {
      new: true, /// veeeerrrryyy !important
    });

    const post = await postToUpdate.save();

    res.send({ success: true, post });
    // console.log("post after update", post);
  } catch (error) {
    console.log("Posts Update ERROR", error.message);
    res.send(error.message);
  }
});

router.get("/list/:userid/search/:text", async (req, res) => {
  let regex = new RegExp(req.params.text, "i");
  const search = await Post.find({
    owner: req.params.userid,
    $or: [
      { title: regex },
      { description: regex },
      { location: regex },
      { company: regex },
      { status: regex },
    ],
  });
  res.send(search);
});

router.get("/single/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate({
      path: "owner",
      select: "firstName lastName email",
    });
    res.send({ success: true, post });
  } catch (error) {
    console.log("Posts Single search ERROR", error.message);
    res.send(error.message);
  }
});
router.patch("/single/notes/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (req.body.type === "add") {
      const newPost = { ...post, notes: [...post.notes, req.body.note] };
    }
  } catch (error) {
    console.log("Posts Single note ERROR", error.message);
    res.send(error.message);
  }
});

// DELETE COMPANY TODO

router.patch("/deletecompanytodo/:postid/:todoid", async (req, res) => {

  try {
    const newPost = await Post.findByIdAndUpdate(
      req.params.postid,
      {
        $pull: { toDoList: { _id: req.params.todoid } },
      },
      { new: true }
    );

    if (newPost) {
      res.send({ success: true, newPost });
    }
  } catch (error) {}
});

// UPDATE COMPANY TODO / TOGGLE CHECKBOX

router.patch("/companytodo/:postid/:todoid", async (req, res) => {
  const postid = req.params.postid;
  const todoid = req.params.todoid;


  try {

    const newPost = await Post.findByIdAndUpdate(
      postid,
      { toDoList: req.body },
      { new: true }
    );

    if (newPost) {
      res.send({ success: true, newPost });
    }
  } catch (error) {
    res.send("UPDATE COMPANY TODO error", error);
  }
});
module.exports = router;
