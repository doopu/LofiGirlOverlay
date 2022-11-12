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
1. Open this link up (Chrome works for sure, not sure anything else): https://doopu.github.io/LofiGirlOverlay/
2. When prompted to give permission to share your tab, grant it for current tab. It should be the one you're shown by default. Important: if you click the wrong tab, the software won't work as expected. Refresh and try again.
3. If necessary, click the video to get it to start playing. It's supposed to autoplay but ¯\_(ツ)_/¯
4. It will take a few seconds to warm up, but after that the artist and song name will appear underneath the YouTube video.
5. Click the 'select file to write to' button and give the name of a new text file. You can also pick an existing file, but it will be overwritten by the tool.
6. Go to OBS, create a new text source and point it towards your new file. Voila - you have the Lofi Girl credits without the stream on your screen.

For the sake of keeping the OCR working correctly, you can safely hide the tab that the software is working on, either by minimising the window or switching to a different tab in the same window. It will continue to work even in the background (for now - until the browser companies decide to break things...)!

### Self-hosted (for techies)
If you do not want to use the github hosted version of the tool or otherwise wish to make changes, you can download this repo, run `python web.py` and point your browser to http://localhost:8000/. This is useful if you want to do changes on the processing side of things (eg. splitting the song / author; improving the accracy... by the way, if you do the second one, do submit a pull request!)

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
- Make it easier on the eye..?
