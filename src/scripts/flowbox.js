const Renderer = require('./renderer');
const EjsRenderer = require('./ejs_renderer');
const Slider = require('./slider');

class Flowbox {
    static init(frame) {
        if (frame.frame_type === 'advanced') {
            return new EjsRenderer(frame);
        } else {
            const f = new Renderer(frame);
            f.rendered((el) => new Slider(el))
            return f;
        }
    }
}

module.exports = Flowbox