const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const playBtnIcon = document.querySelector("#playIcon");
const muteBtn = document.querySelector("#mute");
const muteBtnIcon = document.querySelector("#muteIcon");
const muteDiv = document.querySelector("#muteDiv");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeline = document.querySelector("#timeline");
const fullScreenBtn = document.querySelector("#fullScreen");
const fullScreenBtnIcon = document.querySelector("#fullScreenIcon");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList.add(video.paused ? "fa-play" : "fa-pause");
  playBtnIcon.classList.remove(video.paused ? "fa-pause" : "fa-play");
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList.add(video.muted ? "fa-volume-xmark" : "fa-volume-high");
  muteBtnIcon.classList.remove(
    video.muted ? "fa-volume-high" : "fa-volume-xmark"
  );
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
  } else if (!video.muted && volumeRange.value == 0) {
    video.muted = true;
  }
  muteBtnIcon.classList.add(video.muted ? "fa-volume-xmark" : "fa-volume-high");
  muteBtnIcon.classList.remove(
    video.muted ? "fa-volume-high" : "fa-volume-xmark"
  );
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(Math.floor(seconds) * 1000).toISOString().substring(11, 19);

const handleLoadedMeta = () => {
  totalTime.innerText = formatTime(video.duration);
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(video.currentTime);
  timeline.value = video.currentTime;
  if (video.currentTime === video.duration) {
    video.paused = true;
    playBtn.innerText = "Play";
  }
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
  fullScreenIcon.classList.add(fullscreen ? "fa-expand" : "fa-compress");
  fullScreenIcon.classList.remove(fullscreen ? "fa-compress" : "fa-expand");
  video.classList.add(fullscreen ? "normal-screen" : "full-screen");
  video.classList.remove(fullscreen ? "full-screen" : "normal-screen");
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 1000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 100);
};

const handleVideoControls = () => {
  clearTimeout(controlsMovementTimeout);
  controlsMovementTimeout = null;
  clearTimeout(controlsTimeout);
  controlsTimeout = null;
};

const handleMuteMouseover = (e) => {
  volumeRange.classList.remove("hidden");
};

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

const handleMuteMouseleave = (e) => {
  sleep(100);
  volumeRange.classList.add("hidden");
};

const handlevideoControlsMouseleave = () => {
  videoControls.classList.remove("showing");
};

const handleVideoDblclick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
  fullScreenIcon.classList.add(fullscreen ? "fa-expand" : "fa-compress");
  fullScreenIcon.classList.remove(fullscreen ? "fa-compress" : "fa-expand");
  video.classList.add(fullscreen ? "normal-screen" : "full-screen");
  video.classList.remove(fullscreen ? "full-screen" : "normal-screen");
};

const handleVideoClickPlayPause = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList.add(video.paused ? "fa-play" : "fa-pause");
  playBtnIcon.classList.remove(video.paused ? "fa-pause" : "fa-play");
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMeta);
video.addEventListener("timeupdate", handleTimeUpdate);

video.addEventListener("ended", handleEnded);

timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
videoControls.addEventListener("mouseenter", handleVideoControls);
muteDiv.addEventListener("mouseover", handleMuteMouseover);
muteDiv.addEventListener("mouseleave", handleMuteMouseleave);
videoControls.addEventListener("mouseleave", handlevideoControlsMouseleave);
video.addEventListener("dblclick", handleVideoDblclick);
video.addEventListener("click", handleVideoClickPlayPause);
