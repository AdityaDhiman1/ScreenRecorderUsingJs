let RECODING_MODE = false;
let recoding_toggle = document.getElementById('recoding-toggle');

let mediaRecorder = null;
let chunks = [];

recoding_toggle.addEventListener('click', function () {
    RECODING_MODE = !RECODING_MODE;
    if (RECODING_MODE) {
        recoding_toggle.innerHTML = 'Stop Recording';
        startRecording();
    } else {
        recoding_toggle.innerHTML = 'Start Recording';
        stopRecording();
    }
});

async function startRecording() {
    var stream = await navigator.mediaDevices.getDisplayMedia(
        { video: { mediaSource: 'video' }, audio: true }
    );
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) {
            chunks.push(e.data);
        }
    };

    mediaRecorder.onstop = () => {
        let blob = new Blob(chunks, { type: 'video/webm' });
        chunks = [];
        var dataDownloadUrl = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = dataDownloadUrl;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(dataDownloadUrl);
    };

    mediaRecorder.start(250);
}

function stopRecording() {
    mediaRecorder.stop();
}
