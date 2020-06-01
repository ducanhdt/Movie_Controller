
function turnOffInferring() {
  document.getElementById('infer').checked = false;
  chrome.storage.local.set({
    'infer': false
  }, () => {});
  chrome.extension.sendRequest({
    infer: false
  });
}


function turnOnInferring(){

  document.getElementById('infer').checked = true;
  chrome.storage.local.set({
    'infer': true
  }, () => {});
  chrome.extension.sendRequest({
    infer: true
  });
}

function setupCam() {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(mediaStream => {
    document.querySelector('#webcamVideo').srcObject = mediaStream;
  }).catch((error) => {
    console.warn(error);
  });
}

setupCam();

document.querySelector("#capture").onclick = getImage;
// Setup checkbox with correct initial value.
chrome.storage.local.get('infer', items =>
  document.getElementById('infer').checked = !!items['infer']);

// document.getElementById('infer').onclick = inferButtonClicked;
// document.getElementById('train').onclick = trainClicked;
