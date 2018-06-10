import SubripVideoElement from '../subrip-video-layer-element.js';
customElements.define('subrip-video-layer', SubripVideoElement);

const subripLayer = document.querySelector('subrip-video-layer');
let vidurl = '';
let srturl = '';

document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('dragenter', e => e.preventDefault());
document.addEventListener('drop', e => {

    e.preventDefault();

    const dtfiles = [...e.dataTransfer.files];
    const vid = dtfiles.filter(f => /(mp4|ogg|webm)$/.test(f.name)).pop();
    const srt = dtfiles.filter(f => /srt$/.test(f.name)).pop();

    URL.revokeObjectURL(vidurl);
    URL.revokeObjectURL(srturl);

    subripLayer.src = '';
    subripLayer.video.src = '';

    if (vid) {

        vidurl = URL.createObjectURL(vid);
        srturl = '';
        if (srt) {

            srturl = URL.createObjectURL(srt);

        }

        subripLayer.src = srturl;
        subripLayer.video.src = vidurl;
        subripLayer.video.play();

    }

});

// Basic keyboard shortcuts
let currentFontSize = 25;
document.addEventListener('keydown', e => {

    switch (e.keyCode) {

        // Play / Pause with Space
        case 32: // space
            if (subripLayer.video.paused) {

                if (subripLayer.video.ended) {

                    subripLayer.video.currenTime = 0;

                }

                subripLayer.video.play();

            } else {

                subripLayer.video.pause();

            }
            break;

        // Skip ahead / back with left / right arrow keys
        case 37: // left arrow
            subripLayer.video.currentTime -= 5;
            break;
        case 39: // right arrow
            subripLayer.video.currentTime += 5;
            break;

        // Change subtitle size with up / down arrow keys
        case 38: // up arrow
            currentFontSize += 2;
            subripLayer.style.fontSize = `${ currentFontSize }px`;
            break;
        case 40: // down arrow
            currentFontSize -= 2;
            subripLayer.style.fontSize = `${ currentFontSize }px`;
            break;

    }

});
