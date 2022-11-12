window.addEventListener("DOMContentLoaded", () => {
    startCapture();
});

var canvas;
var context;
var video;
var image;
var captureStream;

const startCapture = async () => {
    canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 70;
    context = canvas.getContext("2d");
    video = document.createElement("video");
    video.autoplay = true;
    image = document.createElement("img");

    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia({preferCurrentTab:true});
        video.srcObject = captureStream;
        setInterval(ocrLoop, 5000);
    } catch (err) {
        console.error("Error: " + err);
    }
};

function ocrLoop() {
    context.drawImage(video, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        // Invert it!
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
        // Now white it out if it's not basically black
        if (data[i] + data[i+1] + data[i+2] > 150) {
            data[i] = 255; // redb
            data[i + 1] = 255; // green
            data[i + 2] = 255; // blue
        }
    }
    context.putImageData(imageData, 0, 0);
    const frame = canvas.toDataURL("image/png");
//    captureStream.getTracks().forEach(track => track.stop());
    image.src = frame;
    document.body.append(image);
    // Do OCR
    Tesseract.recognize(
        frame,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log(text);
        var textDiv = document.getElementById('ocrOutput');
        textDiv.innerHTML = text;
    })
}
