const videoFileText = document.querySelector(".jsVideoFileText");
const videoUploadFile = document.querySelector(".jsVideoUploadBtn");
const imageFileText = document.querySelector(".jsImageFileText");
const imageUploadFile = document.querySelector(".jsImageUploadBtn");

function handleVideoUploadChange(event) {
  const videoFileName = event.target.files[0].name;
  videoFileText.value = videoFileName;
}
function handleImageUploadChange(event) {
  const imageFileName = event.target.files[0].name;
  imageFileText.value = imageFileName;
}

videoUploadFile.addEventListener("change", handleVideoUploadChange);
imageUploadFile.addEventListener("change", handleImageUploadChange);
