const vid = document.querySelector('#webcamVideo');
var localstream;

function vidOff() {
    vid.pause();
    vid.src = "";
    vid.srcObject.getTracks()[0].stop();
}

function turnOffInferring() {
    // document.getElementById('infer').checked = false;
    chrome.storage.local.set({
        'infer': false
    }, () => {});
    chrome.extension.sendRequest({
        infer: false
    });
    vidOff();
}

function inferButtonClicked() {
    if (document.getElementById('infer').checked) {
        document.getElementById('capture').innerHTML = document.getElementById('infer').checked;
        turnOnInferring()
    } else {
        document.getElementById('capture').innerHTML = document.getElementById('infer').checked;
        turnOffInferring()
    }

}

function turnOnInferring() {

    // document.getElementById('infer').checked = true;
    chrome.storage.local.set({
        'infer': true
    }, () => {});
    chrome.extension.sendRequest({
        infer: true
    });
}
setupCam();

function setupCam() {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(mediaStream => {
        document.querySelector('#webcamVideo').srcObject = mediaStream;
        localstream = mediaStream;
    }).catch((error) => {
        console.warn(error);
    });
}


// document.querySelector("#capture").onclick = getImage;
// Setup checkbox with correct initial value.
chrome.storage.local.get('infer', items => {
    document.getElementById('infer').checked = !!items['infer'];
    document.getElementById('capture').innerHTML = !!items['infer']
});

document.getElementById('infer').onclick = inferButtonClicked;