
// Do first-time setup to gain access to webcam, if necessary.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason.search(/install/g) === -1) {
    return;
  }
  chrome.tabs.create({
    url: chrome.extension.getURL('welcome.html'),
    active: true
  });
});

// Mapping of training commands to KNN class indices. Special commands for
// turning off training and for saving training weights are given negative
// indices to signify that no training is to occur.
const optionToClassIndex = {
  'save': -2,
  'off': -1,
  'noaction': 0,
  'down': 1,
  'up': 2
};
const classIndexToDirection = [null, 'down', 'up'];

// Current class index being trained, negative means not training.
let classIndexToTrain = -1;

// True if currently in 'infer' mode, meaning that the webcam is controlling
// scrolling.
let infer = true;

// The previously-predicted class when in 'infer' mode.
let previousPredictedIndex = -1;

// Get previously-stored infer checkbox setting, if any.
chrome.storage.local.get('infer', items => {
  infer = !!items['infer'];
});

// Listener for commands from the extension popup (controller) page.

const vid = document.querySelector('#webcamVideo');

const image = document.querySelector("#capturedimage");

// Setup webcam, initialize the KNN classifier model and start the work loop.
async function setupCam() {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(mediaStream => {
    vid.srcObject = mediaStream;
  }).catch((error) => {
    console.warn(error);
  });
    setInterval(function(){ 
        //code goes here that will be run every 5 seconds. 
        // handleInfer(2);
        getImage()
    }, 500);
  }
  
  // If cam acecss has already been granted to this extension, setup webcam.
  chrome.storage.local.get('camAccess', items => {
    if (!!items['camAccess']) {
      console.log('cam access already exists');
      setupCam();
    }
  });
  
  // If cam acecss gets granted to this extension, setup webcam.
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if ('camAccess' in changes) {
      console.log('cam access granted');
      setupCam();
    }
  });
var getImage = function() {
    // text.innerHTML = "press";
    var canvas = document.createElement("canvas");
    canvas.getContext('2d')
        .drawImage(vid, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    console.log(img.src)
    image.innerHTML = '<img src="' + img.src + '" width="299px" height="299px" />';;
    // text.innerHTML = img.src;
};
  
  // Handles inferences from the KNN classifier.
function handleInfer(classIndex) {
  // If the currently-inferred class is the same as the previously-inferred
  // class then there is nothing to be done.
  // if (classIndex != previousPredictedIndex)
  classIndex =2;
  
  // {
    let tabId = -1;
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      // Find the active tab in the browser.
      if (tabs.length == 0) {
        console.log('no active tab');
        return;
      }
      tabId = tabs[0].id;
      const info = {};
      // Turn off any current scrolling, as a new scroll command has been
      // inferred.
      if (previousPredictedIndex >= 1) {
        info.off = true;
      }
      // previousPredictedIndex = classIndex;
      // Turn on the new scroll direction.
      if (classIndex >= 1) {
        info.on = {direction: classIndexToDirection[classIndex]};
      }
      // Send a message to the active tab indicating which scrolling actions
      // to start or end.
      chrome.tabs.sendMessage(tabId, info);
    });
  // }
}
