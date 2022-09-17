import "../scss/styles.scss";

//upload.pug
const fileText = document.querySelector(".file--text");
const uploadFile = document.querySelector(".upload--btn");

function handleChange(event) {
  const fileName = event.target.files[0].name;
  fileText.value = fileName;
}

uploadFile.addEventListener("change", handleChange);
