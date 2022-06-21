class Slider {
    // dom elements
    frame = undefined;
    track = undefined;
    lists = undefined;

    dataset = undefined;
    productsPerSingleList = 0;
    productsPerSingleView = 0;
    productWidth = 0;
    currentPage = 0;

    handleNext(e) {
        e.preventDefault()

        const productsLeft = Math.floor(this.productsPerSingleList-(this.productsPerSingleView+this.currentPage))

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
            list.style.transform = `translateX(calc(-${this.productWidth * page}px - (${this.dataset.configFrameMarginBetween} * ${page})))`
        }
    }

    constructor(anchor) {
        this.frame = anchor
        this.track = this.frame.querySelector('.flowbox__track')
        this.lists = this.frame.querySelectorAll('.flowbox__list')
        this.dataset = this.frame.dataset;

        // make sure there is at least one list
        if (this.lists.length) {
            this.productsPerSingleList = this.lists[0].children.length
            this.productWidth = this.lists[0].firstElementChild.offsetWidth
        }

        this.productsPerSingleView = (this.track.offsetWidth - ((this.dataset.configMatrixCols-1) * parseInt(this.dataset.configFrameMarginBetween)))/this.productWidth;

        if (this.frame.querySelector('.flowbox__arrows')) {
            const next = this.frame.querySelector('.flowbox__arrow--next')
            const prev = this.frame.querySelector('.flowbox__arrow--prev')

            if (undefined !== next) {
                next.addEventListener('click', this.handleNext.bind(this))
            }

            if (undefined !== prev) {
                prev.addEventListener('click', this.handlePrev.bind(this))
            }
        }
    }
}

module.exports = Slider