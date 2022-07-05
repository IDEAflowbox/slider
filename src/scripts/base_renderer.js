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
            el.insertAdjacentHTML(xpath_injection_position || 'beforeend', html.replace(/\<([a-zA-Z]+)\s/, '<$1 data-frame-id="'+this.fid+'" '));
            this.triggerRenderedCallback();
        } catch (e) {
            console.log(e);
        }
    }

    rendered(callback) {
        this.renderedCallback = callback;
    }

    getElement() {
        return document.querySelector(`*[data-frame-id="${this.fid}"]`);
    }

    triggerRenderedCallback() {
        if (typeof this.renderedCallback === 'function') {
            this.renderedCallback(this.getElement());
        }
    }

    on(event, callback) {
        let isInViewport = false;
        let throttleId = undefined;

        if (event === 'viewport') {
            if (this.frame.frame_type === 'advanced') {
                window.addEventListener('scroll', () => {
                    clearTimeout(throttleId);
                    throttleId = setTimeout(() => {
                        const bounding = this.getElement().getBoundingClientRect();
                        isInViewport = bounding.top >= 0 && bounding.left >= 0 && bounding.right <= window.innerWidth && bounding.bottom <= window.innerHeight;
                        callback(isInViewport);
                    }, 100)
                })
            }
        }
    }
}

module.exports = BaseRenderer;