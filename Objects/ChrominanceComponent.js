import {RGB} from "./RGB.js";
import {createCanvas} from "../Utils/ImageUtils.js";
import { width, height } from "../Utils/ImageUtils.js";

/**
 * Classe reponsavel pelos Componentes Cromaticos
 * 
 * @author Gabriel Fernandes 17/04/2022
 */
export class ChrominanceComponent {
    /**
     * Construtor de um pixel do component cromatico.
     * 
     * @param {*} luminance - Luminancia convertida do RGB (0.299 * red) + (0.587 * green) + (0.114 * blue)
     * @param {*} blueChrominance - Crominancia Azul convertida do RGB (-0.1687 * red) + (-0.3313 * green) + (0.5 * blue) + 128
     * @param {*} redChrominance - Crominancia Vermelha convertida do RGB (0.5 * red) + (-0.4187 * green) + (-0.0813 * blue) + 128
     * @param {*} alpha - Alpha do RGBA
     * 
     * @author Gabriel Fernandes 17/04/2022
     */
    constructor(width, heigth, luminance = [], blueChrominance = [], redChrominance = []/*, alpha = []*/) {
        this.width = width;
        this.height = heigth;
        this.luminance = luminance;
        this.blueChrominance = blueChrominance;
        this.redChrominance = redChrominance;
        //this.alpha = alpha;
    }


    /**
     * #@deprecated
     * 
     * Converte um objeto ChrominanceComponent para RGB
     * 
     * É o responsavel pelo processo inverso do Color Space Conversion,
     * para obtermos de volta os valores originais da imagem apos este
     * passar pelo Chrominance Downsampling
     * 
     * @returns objeto RGB com a informação da imagem
     * 
     * @author Gabriel Fernandes 18/04/2022
     */
    toRGB() {
        const red = [];
        const blue = [];
        const green = [];
        //const alpha = [];

        for(let i = 0; i < (this.width * this.height); i++) {
            // Converte para os pixeis RGB
            red[i] = 1 * this.luminance[i] + 1.13983 * this.redChrominance[i];
            green[i] = 1 * this.luminance[i] - 0.39465 * this.blueChrominance[i] - 0.58060 * this.redChrominance[i];
            blue[i] = 1 * this.luminance[i] + 2.03211 * this.blueChrominance[i];
         //   alpha[i] = this.alpha[i];
        }

        return new RGB(this.width, this.height, red, green, blue);
    }

    drawLuminanceComponent() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;
             
        for(let i = 0, j=0; i < this.luminance.length; i++, j+=4) {
            data[j] = this.luminance[i];    
            data[j + 1] = this.luminance[i]; 
            data[j + 2] = this.luminance[i];            
            data[j + 3] = 255;

            //console.log("R: "+data[i]+"G: "+data[i+1]+"B: "+data[i+2]+"A: "+data[i+3]);   
        } 

        context.putImageData(imgData, imageX, imageY);
    }

    drawBlueChrominanceComponent() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;
             
        for(let i = 0, j=0; i < this.blueChrominance.length; i++, j+=4) {
            data[j] = 0/*this.blueChrominance[i]*/;    
            data[j + 1] = 0/*this.blueChrominance[i]*/; 
            data[j + 2] = this.blueChrominance[i];            
            data[j + 3] = 255;

            //console.log("R: "+data[i]+"G: "+data[i+1]+"B: "+data[i+2]+"A: "+data[i+3]);   
        } 

        context.putImageData(imgData, imageX, imageY);
    }

    drawRedChrominanceComponent() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;
             
        for(let i = 0, j=0; i < this.redChrominance.length; i++, j+=4) {
            data[j] = this.redChrominance[i];    
            data[j + 1] = 0/*this.redChrominance[i]*/; 
            data[j + 2] = 0/*this.redChrominance[i]*/;            
            data[j + 3] = 255;

            //console.log("R: "+data[i]+"G: "+data[i+1]+"B: "+data[i+2]+"A: "+data[i+3]);   
        } 

        context.putImageData(imgData, imageX, imageY);
    }

    rowSize() {
        return this.luminance.length;
    }

    columnSize() {
        return this.luminance[0].length;
    }

    toBinary() {
        let binaryData = "";

        for(let r = 0; r < 1; r++) {
            for(let c = 0; c < 1; c++) {
                // Converte decimal para binario
                for(let n = this.luminance[r][c]; n > 0; n=n/2) {    
                    binaryData += ""+n%2; 
                }  

            }
        }

        return binaryData;
    }
}