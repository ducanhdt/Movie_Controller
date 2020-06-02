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
    // if (document.getElementById('infer').checked===true){
    //   turnOffInferring();
    // }else{
    //   turnOnInferring();
    // }
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
// document.getElementById('train').onclick = trainClicked;


document.addEventListener('DOMContentLoaded', function() {
    var play = document.getElementById('play');
    // onClick's logic below:
    play.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("video-stream html5-main-video")[0].play()',
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var stop = document.getElementById('stop');
    // onClick's logic below:
    stop.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("video-stream html5-main-video")[0].pause()',
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var volumeup = document.getElementById('volumeup');
    // onClick's logic below:
    volumeup.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("video-stream html5-main-video")[0].volume = document.getElementsByClassName("video-stream html5-main-video")[0].volume > 0.9 ? 1: document.getElementsByClassName("video-stream html5-main-video")[0].volume + 0.1',
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var volumedown = document.getElementById('volumedown');
    // onClick's logic below:
    volumedown.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("video-stream html5-main-video")[0].volume = document.getElementsByClassName("video-stream html5-main-video")[0].volume < 0.1 ? document.getElementsByClassName("video-stream html5-main-video")[0].volume: document.getElementsByClassName("video-stream html5-main-video")[0].volume - 0.1',
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var seek = document.getElementById('seek');
    // onClick's logic below:
    seek.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: 'var player = document.getElementsByClassName("video-stream html5-main-video")[0];var curT = player.currentTime;player.currentTime = curT < player.duration - 10 ? curT + 10 : player.duration',
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var rewind = document.getElementById('rewind');
    // onClick's logic below:
    rewind.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: 'var player = document.getElementsByClassName("video-stream html5-main-video")[0];var curT = player.currentTime;player.currentTime = curT < 10 ? 0 : curT - 10;',
        });
    });
});