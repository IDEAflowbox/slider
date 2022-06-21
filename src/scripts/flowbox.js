const Renderer = require('./renderer');
const EjsRenderer = require('./ejs_renderer');
const Slider = require('./slider');

class Flowbox {
    static init(frame) {
        if (frame.frame_type === 'advanced') {
            new EjsRenderer(frame);
        } else {
            new Renderer(frame).rendered((el) => new Slider(el))
        }
    }
}

module.exports = Flowbox