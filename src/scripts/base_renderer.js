class BaseRenderer {
    renderedCallback = undefined;
    frame = undefined
    fid = undefined

    constructor(frame) {
        this.frame = frame
        this.fid = (Math.random() + 1).toString(36).substring(7);
    }

    getRenderSettings() {
        return this.frame.render_settings
            .sort((a, b) => b.priority - a.priority)
            .find((rs) => window.location.pathname.match(new RegExp(rs.filter)));
    }

    render(xpath, xpath_injection_position, html) {
        try {
            const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            el.insertAdjacentHTML(xpath_injection_position || 'beforeend', html);
            this.triggerRenderedCallback();
        } catch (e) {
            console.log(e);
        }
    }

    rendered(callback) {
        this.renderedCallback = callback;
    }

    getElement() {
        return undefined;
    }

    triggerRenderedCallback() {
        if (typeof this.renderedCallback === 'function') {
            this.renderedCallback(this.getElement());
        }
    }
}

module.exports = BaseRenderer;