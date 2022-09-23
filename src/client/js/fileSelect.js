const FileText = document.querySelector(".jsFileText");
const UploadFile = document.querySelector(".jsUploadBtn");

function handleUploadChange(event) {
  const FileName = event.target.files[0].name;
  FileText.value = FileName;
}

UploadFile.addEventListener("change", handleUploadChange);
