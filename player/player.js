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
    const vid = dtfiles.filter(f => /(mp4|mov|avi|webm)$/.test(f.name)).pop();
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
    console.log(e.dataTransfer.files);

});
