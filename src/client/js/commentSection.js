const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector("#commentForm");

const handleDeleteBtn = async (event) => {
  const videoId = videoContainer.dataset.id;
  const commentId = event.path[1].dataset.id;
  const deleteComment = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentId,
      videoId,
    }),
  });
  const li = event.target.parentElement;
  li.remove();
};

const addComment = (text, id, time) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");

  const justDiv = document.createElement("div");
  const commentColumn = document.createElement("div");
  commentColumn.className = "comment__column";

  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  const spanDate = document.createElement("span");
  span.innerText = ` ${text}`;
  spanDate.innerText = `${String(time.getMonth()).padStart(2, "0")}월 ${String(
    time.getDate()
  ).padStart(2, "0")}일 ∙ ${String(time.getHours()).padStart(
    2,
    "0"
  )}시 ${String(time.getMinutes()).padStart(2, "0")}분`;
  const xButton = document.createElement("button");
  xButton.innerText = "❌";
  xButton.className = "deleteBtn";
  const thumbUpBtn = document.createElement("i");
  thumbUpBtn.className = "far fa-thumbs-up commentLiked";

  newComment.appendChild(justDiv);
  justDiv.appendChild(icon);
  justDiv.appendChild(commentColumn);
  justDiv.appendChild(thumbUpBtn);
  commentColumn.appendChild(span);
  commentColumn.appendChild(spanDate);
  newComment.appendChild(xButton);

  videoComments.prepend(newComment);
  const deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDeleteBtn);
  });

  const thumbsUp = document.querySelectorAll(".fa-thumbs-up");
  thumbsUp.forEach((thumbUp) => {
    thumbUp.addEventListener("click", handleThumbsUpBtn);
  });
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const time = new Date();
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return "";
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId, time);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}

const deleteBtns = document.querySelectorAll(".deleteBtn");
deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", handleDeleteBtn);
});

const handleThumbsUpBtn = async (event) => {
  const commentId = event.path[2].dataset.id;
  const videoId = videoContainer.dataset.id;
  const targetThumbsUp = event.target;
  const thumbsUpComment = await fetch(`/api/videos/${videoId}/comment/thumb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentId,
      videoId,
    }),
  });
  if (thumbsUpComment.status === 200) {
    const { likedStatus } = await thumbsUpComment.json();
    if (likedStatus) {
      targetThumbsUp.classList.replace("far", "fas");
    } else {
      targetThumbsUp.classList.replace("fas", "far");
    }
  }
};

const commentNumber = document.querySelectorAll(".video__comment");
if (commentNumber.length !== 0) {
  const thumbsUp = document.querySelectorAll(".fa-thumbs-up");
  thumbsUp.forEach((thumbUp) => {
    thumbUp.addEventListener("click", handleThumbsUpBtn);
  });
}
