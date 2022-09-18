import "../scss/styles.scss";

//upload.pug
const fileText = document.querySelector(".jsFileText");
const uploadFile = document.querySelector(".jsUploadBtn");

function handleUploadChange(event) {
  const fileName = event.target.files[0].name;
  fileText.value = fileName;
}

uploadFile.addEventListener("change", handleUploadChange);
