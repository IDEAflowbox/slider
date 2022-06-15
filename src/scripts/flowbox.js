const ejs = require('ejs/ejs.min')

class Flowbox {
    currentPage = 0
    productsPerPage = undefined
    productsPerList = undefined
    productWidth = undefined
    flowbox = undefined
    initialCols = undefined
    responsive = {
        480: 1,
        675: 2,
        775: 3,
        850: 4,
    }
    products = []

    sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    constructor(anchor, payload) {
        this.anchor = anchor
        this.payload = payload

        this.products = this.sliceIntoChunks(payload.products, Math.ceil(payload.products.length/payload.config.matrix.rows))
        this.initialCols = payload.config.matrix.cols
        this.resizeWindow()
        window.addEventListener('resize', this.resizeWindow.bind(this));
    }

    resizeWindow() {
        let nextNumberOfCols = this.initialCols
        const sizes = Object.keys(this.responsive)
        for (let i = 0; i < sizes.length; i++) {
            if (window.innerWidth <= sizes[i]) {
                nextNumberOfCols = this.responsive[sizes[i]]
                break
            }
        }

        if (nextNumberOfCols > this.initialCols) {
            return
        }

        this.payload = {
            ...this.payload,
            config: {
                ...this.payload.config,
                matrix: {
                    ...this.payload.config.matrix,
                    cols: nextNumberOfCols,
                }
            }
        }
        this.render()
    }

    handleNext(e) {
        e.preventDefault()

        const productsLeft = Math.floor(this.productsPerList-(this.productsPerPage+this.currentPage))

        if (productsLeft === 0) {
            return
        }

        this.rewindTo(++this.currentPage)
    }

    handlePrev(e) {
        e.preventDefault()
        if (this.currentPage <= 0) {
            return
        }

        this.rewindTo(--this.currentPage)
    }

    rewindTo(page) {
        for (let i = 0; i < this.lists.length; i++) {
            const list = this.lists[i]
            list.style.transform = `translateX(calc(-${this.productWidth * page}px - (${this.payload.config['frame']['margin_between']} * ${page})))`
        }
    }

    render() {
        const template = document.getElementById('flowbox_template').innerHTML;
        const render = ejs.compile(template);

        this.anchor.innerHTML = render({
            ...this.payload,
            products: this.products,
        })
        this.flowbox = this.anchor.firstElementChild

        this.track = this.flowbox.querySelector('.flowbox__track')
        this.lists = this.flowbox.querySelectorAll('.flowbox__list')

        // make sure there is one list at least
        if (this.lists.length > 0) {
            this.productsPerList = this.lists[0].children.length
            this.productWidth = this.lists[0].firstElementChild.offsetWidth
        }

        // todo: make it more readable
        this.productsPerPage = (this.track.offsetWidth - ((this.payload.config['matrix']['cols']-1) * parseInt(this.payload.config['frame']['margin_between'])))/this.productWidth

        // arrows are prepared
        if (this.flowbox.querySelector('.flowbox__arrows')) {
            const next = this.flowbox.querySelector('.flowbox__arrow--next')
            const prev = this.flowbox.querySelector('.flowbox__arrow--prev')

            if (undefined !== next) {
                next.addEventListener('click', this.handleNext.bind(this))
            }

            if (undefined !== prev) {
                prev.addEventListener('click', this.handlePrev.bind(this))
            }
        }
    }
}

module.exports = Flowbox