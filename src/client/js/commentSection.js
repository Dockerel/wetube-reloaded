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
  spanDate.innerText = `${time.getMonth()}월 ${time.getDate()}일 ∙ ${time.getHours()}시 ${time.getMinutes()}분`;
  const xButton = document.createElement("button");
  xButton.innerText = "❌";
  xButton.className = "deleteBtn";

  newComment.appendChild(justDiv);
  justDiv.appendChild(icon);
  justDiv.appendChild(commentColumn);
  commentColumn.appendChild(span);
  commentColumn.appendChild(spanDate);
  newComment.appendChild(xButton);

  videoComments.prepend(newComment);
  const deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDeleteBtn);
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
