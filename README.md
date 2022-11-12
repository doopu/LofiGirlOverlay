Lofi Girl Overlay
====================
This mini-project serves as a way to extract the artist and song information from the Lofi Girl stream, for use in streams where they wish to credit the artist but do not want to use a cropped version of the Lofi Girl stream to do so.

If a better way of doing this is available (perhaps a feed of songs?) do let me know, because the way this project does it is rather terrible.

Warning
---------
The method used to extract the artist and song names is not completely infallible. It is known to struggle with certain characters, such as `j`s and `|`s. If you must have 100% accuracy, this will not be the project for you (yet?)

How To Use
-----------
### Most Folks
This project exposes a web source on github.io for use in OBS. Just point your web source here:

When prompted to give permission to share your tab, grant it for current tab. If necessary, also click 'play' on the YouTube video.

It will take a few seconds to warm up, but after that the artist and song name will appear underneath the YouTube video. You can style this text by using the CSS override in OBS. The div ID to style is `#ocrOutput`.

Then it's just a case of cropping the web source and putting it in your scene. Note that the text is left-aligned, so you can always crop up to the left edge of the text safely.

### Self-hosted (for techies)
If you do not want to use the github hosted version of the tool or otherwise wish to make more extensive changes than the CSS, you can download this repo, run `python web.py` and point your web source to http://localhost:8000/. You might evne be able to use the 'local file' functionality in OBS, it's your call.

How It Works
--------------
The Lofi Girl stream is embedded into index.html. A function is then called on a five second loop to take a screencap of the current tab. This is a dire, dire workaround for the problem of not being able to rip the latest frame from a YouTube video, and is a point of improvement.

Once the screencap is obtained, [Tesseract.js](https://tesseract.projectnaptha.com/) is used to perform OCR on it. The result of the OCR is dumped into a div with ID  `ocrOutput`. Before OCR is performed, a heuristic approach is taken to clean the image (read: I messed aroud until it gave a decent result).

Improvement Points
----------------------
- Improve method of grabbing YouTube screenshots. It's clunky and intrusive.
- Improve OCR; I suspect the OCR itself is fine, but the method used to remove all the unwanted background information is not perfect. Perhaps we need to look at a computer vision approach in the future (but then it gets harder to do entirely in the browser, so...)

Expansion Ideas
-------------------
- Genericise this for any stream or YouTube video that has the song information encoded into the video itself.
