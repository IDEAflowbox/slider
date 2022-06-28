const BaseRenderer = require('./base_renderer');
const template = require('../templates/frame.ejs');

class Renderer extends BaseRenderer {
    products = [];
    config = undefined;
    defaultNumberOfColumns = undefined;
    throttleId = undefined;
    breakpoints = {
        480: 1,
        675: 2,
        775: 3,
        850: 4,
    };

    constructor(frame, preventRendering = false) {
        super(frame);

        this.products = this.sliceIntoChunks(frame.products, Math.ceil(frame.products.length/frame.config.matrix.rows));
        this.config = frame.config;
        this.defaultNumberOfColumns = this.config.matrix.columns;

        if (false === preventRendering) {
            const renderSetting = this.getRenderSettings();

            if (!renderSetting) {
                return;
            }

            this.render(
                renderSetting.xpath,
                renderSetting.xpath_injection_position,
                this.compile(),
                this.triggerRenderedCallback
            );
        }

        this.makeItResponsive();
        window.addEventListener('resize', this.makeItResponsive.bind(this));
    }

    sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    makeItResponsive() {
        clearTimeout(this.throttleId);
        this.throttleId = setTimeout(() => {
            let nextNumberOfColumns = this.defaultNumberOfColumns;
            const sizes = Object.keys(this.breakpoints);
            for (let i = 0; i < sizes.length; i++) {
                if (window.innerWidth <= sizes[i]) {
                    nextNumberOfColumns = this.breakpoints[sizes[i]];
                    break;
                }
            }

            if (nextNumberOfColumns > this.defaultNumberOfColumns) {
                return;
            }

            this.config = {
                ...this.config,
                matrix: {
                    ...this.config.matrix,
                    columns: nextNumberOfColumns,
                },
            };

            try {
                this.getElement().outerHTML = this.compile();
                this.triggerRenderedCallback();
            } catch (e) {
                console.log(e);
            }
        }, 100);
    }

    renderToElement(el) {
        el.innerHTML = this.compile();
        this.triggerRenderedCallback();
    }

    compile() {
        return template({
            config: this.config,
            products: this.products,
            fid: this.fid,
        });
    }

    getElement() {
        return document.querySelector(`.flowbox[data-frame-id="${this.fid}"]`);
    }
}

module.exports = Renderer