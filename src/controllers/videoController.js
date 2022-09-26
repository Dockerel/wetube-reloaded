import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  const users = await User.find({});
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id).populate("owner").populate("comments");
  const videos = await Video.find({}).populate("owner");
  if (video === null) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video, videos });
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title} `, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findOne({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  // const {
  //   user: { _id },
  // } = req.session;
  // const { path: fileUrl } = req.file;
  // const { title, description, hashtags } = req.body;
  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  } else {
    const comment = await Comment.create({
      text,
      owner: user._id,
      video: id,
    });
    video.comments.push(comment._id);
    await video.save();
    return res.status(201).json({ newCommentId: comment._id });
  }
};

export const deleteComment = async (req, res) => {
  const {
    session: { user },
    body: { commentId, videoId },
  } = req;
  const commentUser = await Comment.find({ _id: commentId });
  const commentWriter = commentUser[0].owner;

  if (String(user._id) === String(commentWriter)) {
    // 세션의 현재 로그인해 있는 유저 === comment의 owner
    await Comment.findOneAndDelete({ _id: commentId });
  }
  return res.sendStatus(200);
};

export const thumbsUpComment = async (req, res) => {
  const {
    body: { commentId, videoId },
  } = req;
  const targetComment = await Comment.findOne({ _id: commentId });
  console.log(targetComment);
  if (targetComment.liked === true) {
    targetComment.liked = false;
  } else if (targetComment.liked === false) targetComment.liked = true;
  await targetComment.save();
  return res.status(200).json({ likedStatus: targetComment.liked });
};
