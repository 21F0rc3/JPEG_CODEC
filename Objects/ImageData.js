import { width, height } from "../Utils/ImageUtils.js";
import { RGB } from "./RGB.js";
import { ChrominanceComponent } from "./ChrominanceComponent.js";
import {createCanvas} from "../Utils/ImageUtils.js";

/**
 * Class ImageData
 * 
 * Ela é utilizada para desenhar as imagens no Canvas
 * 
 * A sua estrtura e um array, que em 4 em 4 indices se encontra um pixel.
 * Por exemplo,
 * [0] = 255
 * [1] = 12
 * [2] = 245
 * [3] = 244
 * 
 * Equivale a um pixel com codigo RGBA de 
 * -> red = 255, green = 12, blue = 245, alpha = 244
 * 
 * @author Gabriel Fernandes 18/04/2022
 */
export class ImageData {
    constructor(imageData) {
        //let imageData = context.getImageData(0, 0, width, height);
        this.data = imageData;
    }

    static createTestImageData(data) {
        let testImage = [
            255,255,0,255,255,
            255,0,255,0,255,
            0,255,255,255,0,
            255,0,255,0,255,
            255,255,0,255,255
        ];
        
        // So para criar uma imagem teste
        for(let i=0, j=0; i<testImage.length; i++, j+=4) {
            data[j] = testImage[i];
            data[j+1] = testImage[i];
            data[j+2] = testImage[i];
            data[j+3] = testImage[i];
        }
    }

    /**
     * Desenha a imagem a partir da informação guardada no array de pixeis
     * 
     * @author Gabriel Fernandes 18/04/2022
     */
    drawImage() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;

        for(let i=0, n = this.data.length * 4; i < n; i+=4) {
            data[i] = this.data[i];
            data[i+1] = this.data[i+1];
            data[i+2] = this.data[i+2];
            data[i+3] = 255; // Alpha
        }
    
        context.putImageData(imgData, imageX, imageY);
    }

    /**
     * Converte um objeto ImageData para um Objeto RGB
     * 
     * Ao inves de termos um array em que cada 4 indices
     * representam 1 pixel, temos 4 arrays diferentes para cada cor(e o alpha)
     * 
     * Outra diferença e que passamos a ter um array multidimensional
     * que representa a grelha de pixeis da imagem ou seja teremos row e cols
     * na row = 0, col = 3 teremos um pixel. 
     * 
     * @returns Novo objeto RGB com as informações da imagem
     * 
     * @author Gabriel Fernandes 18/04/2022 
     */
    toRGB() {
        // Arrays 2D
        let red = [], green = [], blue = [];

        for(let i=0, j=0; i < (height * width); i++, j+=4) {
                red[i] = this.data[j];
                green[i] = this.data[j + 1];
                blue[i] = this.data[j + 2];
        }

        return new RGB(height, width, red, green, blue);
    }
}