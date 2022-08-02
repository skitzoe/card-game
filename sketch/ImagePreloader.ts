class ImagePreloader {
    static preloadedImages:any = {}

    public ImagePreloader() {
    }
    static loadImages() {
        for (let index = 0; index < 4; index++) {
            ImagePreloader.preloadedImages['brow'+index] = loadImage(`images/eyebrows/brow${index+1}.png`)
        }
        for (let index = 0; index < 7; index++) {
            ImagePreloader.preloadedImages['face'+index] = loadImage(`images/face/face${index+1}.png`)
        }
        for (let index = 0; index < 11; index++) {
            ImagePreloader.preloadedImages['glasses'+index] = loadImage(`images/glasses/glasses${index+1}.png`)
        }
        for (let index = 0; index < 20; index++) {
            ImagePreloader.preloadedImages['hair'+index] = loadImage(`images/hair/hair${index+1}.png`)
        }
        for (let index = 0; index < 10; index++) {
            ImagePreloader.preloadedImages['shirt'+index] = loadImage(`images/shirt/shirt${index+1}.png`)
        }
        for (let index = 0; index < 25; index++) {
            ImagePreloader.preloadedImages['hair'+index] = loadImage(`images/hair/hair${index+1}.png`)
        }
        for (let index = 0; index < 6; index++) {
            ImagePreloader.preloadedImages['mouth'+index] = loadImage(`images/mouth/mouth${index+1}.png`)
        }
    }
}