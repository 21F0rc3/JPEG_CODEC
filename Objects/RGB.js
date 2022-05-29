import {ChrominanceComponent} from "./ChrominanceComponent.js";
import {ImageData} from "./ImageData.js";

/**
 * Class RGB
 *
 * Todos os pixeis da imagem representam um indice nos quatro arrays
 * Cada array representam o valor daquela cor no formato RGBA
 *
 * Por exemplo,
 * red[0] = 132
 * green[0] = 35
 * blue[0] = 44
 * alpha[0] = 245
 *
 * Equivale ao primeiro pixel da imagem com codigo RGBA
 * -> red = 132, green = 35, blue = 44, alpha = 245
 *
 * @param red {number[]}
 * @param green {number[]}
 * @param blue {number[]}
 * @param width {number}
 * @param height {number}
 *
 * @author Gabriel Fernandes 18/04/2022
 */
export class RGB {
    constructor(width, height, red = [], green = [], blue = []/*, alpha = []*/) {
        this.width = width;
        this.heigth = height;
        this.red = red;
        this.green = green;
        this.blue = blue;
      //  this.alpha = alpha;
    }

    /**
     * Converte um objeto RGB para ChrominanceComponent
     *
     * É o responsavel pelo processo de Color Space Conversion.
     *
     * Calcula os valores de luminancia, azul cromatico e vermelho cromatico
     * a partir dos valores RGB, segundo uma formula
     *
     * @returns objeto ChrominanceComponent com a informação da imagem
     *
     * @author Gabriel Fernandes 18/04/2022
     */
    toChrominanceComponent() {
        const Y = [];
        const Cb = [];
        const Cr = [];
        //const A = [];

        //console.log(this.red[0]);

        // Itera os pixels da imagem
        for (let i = 0; i < (this.width * this.heigth); i++) {
            // Converte para os pixeis cromaticos
            let luminance = (0.299 * this.red[i]) + (0.587 * this.green[i]) + (0.114 * this.blue[i]);
            let blueChrominance = (-0.14713 * this.red[i]) + (-0.28886 * this.green[i]) + (0.436 * this.blue[i]);
            let redChrominance = (0.615 * this.red[i]) + (-0.51499 * this.green[i]) + (-0.10001 * this.blue[i]);
           // let alpha = this.alpha[i];

            Y[i] = luminance;
            Cb[i] = blueChrominance;
            Cr[i] = redChrominance;
        }

        return new ChrominanceComponent(this.width, this.heigth, Y, Cb, Cr);
    }

    /**
     * Coonverte um objeto RGB para ImageData
     *
     * Ao inves de termos 4 arrays para cada cor, temos um unico
     * array com 4 indices para representar um pixel
     *
     * @returns objeto ImageData com a informação da imagem
     *
     * @author Gabriel Fernandes 21/04/2022
     */
    toImageData() {
        const imageData = [];

        // Itera os pixeis da imagem
        for (let i = 0, j = 0; i < (this.width * this.heigth); i++, j += 4) {
            imageData[j] = this.red[i];
            imageData[j + 1] = this.green[i];
            imageData[j + 2] = this.blue[i];
            imageData[j + 3] = 255;
        }

        return new ImageData(imageData);
    }
}