window.addEventListener("DOMContentLoaded", () => {
    startCapture();
});

var canvas;
var context;
var video;
var image;

// This function deals with setting everything up. It creates a canvas,
// video, and image element. We then ask for permission to view the user's
// 'screen' - although we only want them to select the current tab.
// Maybe in the future we can force this with some arguments.
// Once we have permission, we set the video element to reflect this and
// start the OCR loop.
const startCapture = async () => {
    canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 70;
    context = canvas.getContext("2d");
    video = document.createElement("video");
    video.autoplay = true;
    image = document.createElement("img");

    try {
        var captureStream = await navigator.mediaDevices.getDisplayMedia({preferCurrentTab:true});
        video.srcObject = captureStream;
        setInterval(ocrLoop, 5000);
    } catch (err) {
        console.error("Error: " + err);
    }
};

// The OCR loop takes whatever is currently the latest frame in the video track,
// and draws it onto the canvas. We then get the image data from the canvas
// (yes, this is rather roundabout) and do some magic on it before passing it
// to the OCR. More info on that inside the function.
// Lastly, we take the OCR result and put it on the screen.
function ocrLoop() {
    context.drawImage(video, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // We're going to tidy up the image by removing everything that
    // isn't the text.
    // First we invert the image so the white text becomes  black,
    // then we get rid of anything that isn't close to black. This approach
    // is less than perfect, but it's good enough for most cases.

    // In particular, during 'the day' of the stream, the outside of the window
    // is bright. The value '150' was chosen because at this cut-off
    // the sky is excluded while the text is included. We'd like to make the
    // cut-off higher to get bolder text, but alas - the sky ruins it.
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
    // If debugging, un-comment this out to see what the OCR sees.
    // image.src = frame;
    // document.body.append(image);

    // Now do the OCR!
    Tesseract.recognize(
        frame,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log(text);
        if (!text.includes("ofi hip hop rad")) {
            // in case the user is hovering over the video
            var textDiv = document.getElementById('ocrOutput');
            textDiv.innerHTML = text;
        }
    })
}
