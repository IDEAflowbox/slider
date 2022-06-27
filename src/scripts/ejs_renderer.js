const BaseRenderer = require('./base_renderer');
const ejs = require('ejs/ejs.min')

class EjsRenderer extends BaseRenderer {
    constructor(frame, preventRendering = false) {
        super(frame);

        if (false === preventRendering) {
            const renderSetting = this.getRenderSettings();

            if (!renderSetting) {
                return;
            }

            this.render(renderSetting.xpath, renderSetting.xpath_injection_position, this.compile());
        }
    }

    compile() {
        const template = this.frame.html;
        const render = ejs.compile(template);

        return render({
            products: this.frame.products,
            fid: this.fid,
        });
    }

    renderToElement(el) {
        el.innerHTML = this.compile();
        this.triggerRenderedCallback();
    }
}

module.exports = EjsRenderer;