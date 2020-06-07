const vid = document.querySelector('#webcamVideo');

const image = document.querySelector("#capturedimage");

var intervalId = null;
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

function vidOff() {
    vid.pause();
    vid.src = "";
    if (vid.srcObject) vid.srcObject.getTracks()[0].stop();
}
let infer = false;
// Get previously-stored infer checkbox setting, if any.
chrome.storage.local.get('infer', items => {
    infer = !!items['infer'];
});

// Listener for commands from the extension popup (controller) page.

let createtab = true;
// Setup webcam, initialize the KNN classifier model and start the work loop.
async function setupCam() {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(mediaStream => {
        vid.srcObject = mediaStream;
    }).catch((error) => {
        console.warn(error);
    });
}

// If cam acecss gets granted to this extension, setup webcam.
chrome.storage.onChanged.addListener((changes, namespace) => {

    if ('infer' in changes) {
        var infer_state = changes['infer'].newValue;
        if (infer_state) {
            // If cam acecss has already been granted to this extension, setup webcam.
            chrome.storage.local.get('camAccess', items => {
                if (!!items['camAccess']) {
                    console.log('cam access already exists');
                    setupCam();
                }
            });

            console.log("ON");
            console.log(intervalId);

            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(() => {
                imageSrc = getImage();
                handleSubmit(imageSrc);
            }, 2000);
        } else {
            vidOff();
            if (intervalId) {
                clearInterval(intervalId);
            }
            console.log('OFF');
        }

    }
});
const canvas = document.createElement("canvas");

var getImage = function() {
    canvas.setAttribute('width', '640'); // clears the canvas
    canvas.setAttribute('height', '480'); // clears the canvas
    canvas.getContext('2d').drawImage(vid, 0, 0);
    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    image.innerHTML = '<img src="' + img.src + '"/>';
    return img.src
};

function handleSubmit(imageSrc) {
    // event.preventDefault();
    var url = "http://localhost:5000/movie_controller";
    var json = { imageSrc: imageSrc };
    json = JSON.stringify(json);

    fetch(url, {
        method: 'POST',
        body: json,
        headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
        crossDomain: true
    }).then(res => res.json()).then(result => {
        var str = result['content'];
        if (str == "0") {
            volumeDownVid();
        } else if (str == "1") {
            rewindVid();
        } else if (str == "2") {
            volumeUpVid();
        } else if (str == "3") {
            seekVid();
        } else if (str == "4") {
            playStopVid();
        }
    })
}

const youtube = 'document.getElementsByClassName("video-stream html5-main-video")[0]';

function playStopVid() {
    chrome.tabs.executeScript({
        code: 'if (' + youtube + '.paused) { ' + youtube + '.play();}else {' + youtube + '.pause(); }',
    });
}

function volumeUpVid() {
    chrome.tabs.executeScript({
        code: youtube + '.volume = ' + youtube + '.volume > 0.9 ? 1 : ' + youtube + '.volume + 0.1 ',
    });
}

function volumeDownVid() {
    chrome.tabs.executeScript({
        code: youtube + '.volume = ' + youtube + '.volume < 0.1 ? ' + youtube + '.volume: ' + youtube + '.volume - 0.1 ',
    });
}

function seekVid() {
    chrome.tabs.executeScript({
        code: 'var player = ' + youtube + ';var curT = player.currentTime;player.currentTime = curT < player.duration - 10 ? curT + 10 : player.duration ',
    });
}

function rewindVid() {
    chrome.tabs.executeScript({
        code: 'var player = ' + youtube + ';var curT = player.currentTime;player.currentTime = curT < 10 ? 0 : curT - 10',
    });
}