import SubRipParser from './SubRipParser.js';

// TODO: Support full screen
export default
class SubripVideoLayerElement extends HTMLElement {

    static get observedAttributes () {

        return ['src'];

    }

    get video () {

        return this.querySelector('video');

    }

    get src () {

        return this.getAttribute('src') || '';

    }

    set src (val) {

        this.setAttribute('src', val);

    }

    // TODO: Implement the ability to convert to and from VTT and use
    // the built in VTT functionality
    get useVideoTrack () {

        return !!this.hasAttribute('use-text-track');

    }

    set useTextTrack (val) {

        val ? this.setAttribute('use-text-track') : this.removeAttribute('use-text-track');

    }

    constructor () {

        super();

        const subtitleContainerStyle =
            `
                :host {
                    font-family: helvetica, arial, sans-serif;
                    color: white;
                    font-weight: bold;
                    font-size: 25px;
                    text-shadow: ${ this._getTextShadowStyle() };
                    text-align:center;
                    display: inline-block;
                }

                :host .subtitle-container {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    position:absolute;
                }

                :host .subtitle-container > *:first-child {
                    margin-top: auto;
                }

                :host .subtitle-container > *:last-child {
                    margin-bottom: 40px;
                }

                :host .subtitle-container > * {
                    padding: 5px;
                    display: inline-block;
                    word-wrap: break-word;
                }
            `;

        // Create global default styles for the video tag and browsers that
        // can't use the shadowRoot
        if (!this.constructor._styleTag) {

            const styleTag = document.createElement('style');
            styleTag.innerHTML =
            `
                ${ this.tagName } video { width: 100%; height: 100% }
                ${ subtitleContainerStyle.replace(/:host/g, this.tagName) }
            `;

            document.head.appendChild(styleTag);
            this.constructor._styleTag = styleTag;

        }

        // Initialize the subtitle container, style, and slot tags
        this.attachShadow({ mode: 'open' });

        const subc = document.createElement('div');
        subc.classList.add('subtitle-container');

        const sstyle = document.createElement('style');
        sstyle.innerHTML = subtitleContainerStyle;

        this.shadowRoot.appendChild(sstyle);
        this.shadowRoot.appendChild(subc);
        this.shadowRoot.appendChild(document.createElement('slot'));

        this._subtitleContainer = subc;
        this._lastTime = 0;
        this.subtitles = null;

        // TODO: add a mutation observer to the video so
        // it can be added and removed from the wrapper
        this.video.addEventListener('timeupdate', () => this.updateSubtitles());

    }

    // Watch for when the subtitle tag changes
    attributeChangedCallback (attr, oldval, newval) {

        switch (attr) {

            case 'src':
                this.subtitles = null;
                this.updateSubtitles();
                if (newval) {

                    fetch(newval)
                        .then(res => res.text())
                        .then(txt => {

                            this.subtitles = (new SubRipParser()).parse(txt);
                            this.updateSubtitles();

                        });

                }
                break;

        }

    }

    // Update the subtitles being displayed
    updateSubtitles () {

        const vid = this.video;
        if (this.subtitles && vid) {

            // Iterate over all the subtitles and find the ones
            // that should be displayed right now. This approach
            // is pretty heavy handed.
            // NOTE: this takes ~0.01 to 0.1ms per frame to remove
            // and re-add all the subtitle divs.
            const subtitles = this.subtitles;
            const ct = vid.currentTime;
            let res = '';
            for (let i = 0, l = subtitles.length; i < l; i++) {

                const sub = subtitles[i];
                if (ct > sub.start && ct < sub.end) {

                    res += sub.subtitle.map(s => `<div>${ s }</div>`).join('');

                }

            }

            this._subtitleContainer.innerHTML = res;
            this._lastTime = vid.currentTime;

        } else {

            this._subtitleContainer.innerHTML = '';
            this._lastTime = 0;

        }

    }

    /* Utilities */
    _getTextShadowStyle () {

        const offsets = [];
        const total = 160;
        for (let i = 0; i < total; i++) {

            const angle = 2 * Math.PI * (i / total);
            offsets.push([ Math.sin(angle).toFixed(3), Math.cos(angle).toFixed(3) ]);

        }

        return offsets
            .map(os => `${ os[0] * 3 }px ${ os[1] * 3 }px black`)
            .join(',');

    }

}
