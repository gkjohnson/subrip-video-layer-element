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

    constructor () {

        super();

        const subtitleContainerStyle =
            `
                :host {
                    font-family: helvetica, arial, sans-serif;
                    color: white;
                    font-weight: bold;
                    font-size: 20px;
                    text-shadow: ${ this._getTextShadowStyle() };
                    text-align:center;
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

        if (!this.constructor._styleTag) {

            const styleTag = document.createElement('style');
            styleTag.innerHTML =
            `
                ${ this.tagName } { display: inline-block; }
                ${ this.tagName } video { width: 100%; height: 100% }
                ${ subtitleContainerStyle.replace(':host', this.tagName) }
            `;

            document.head.appendChild(styleTag);
            this.constructor._styleTag = styleTag;

        }

        this.attachShadow({ mode: 'open' });

        const subc = document.createElement('div');
        subc.classList.add('subtitle-container');

        const sstyle = document.createElement('style');
        sstyle.innerHTML = subtitleContainerStyle;

        this.shadowRoot.appendChild(sstyle);
        this.shadowRoot.appendChild(subc);
        this.shadowRoot.appendChild(document.createElement('slot'));

        this._subtitleContainer = subc;
    }

    attributeChangedCallback (attr, oldval, newval) {

        switch (attr) {

            case 'src':
                break;

        }

    }

    /* Utilities */
    _getTextShadowStyle () {

        const offsets = [];
        const total = 16;
        for (let i = 0; i < total; i++) {

            const angle = 2 * Math.PI * (i / total);
            offsets.push([ Math.sin(angle).toFixed(3), Math.cos(angle).toFixed(3) ]);

        }

        return offsets
            .map(os => `${ os[0] * 3 }px ${ os[1] * 3 }px black`)
            .join(',');

    }

}
