/**
 * Classe reponsavel pelos Componentes Cromaticos
 * 
 * @author Gabriel Fernandes 17/04/2022
 */
class ChrominanceComponent {
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
    constructor(luminance = [], blueChrominance = [], redChrominance = [], alpha = []) {
        this.luminance = luminance;
        this.blueChrominance = blueChrominance;
        this.redChrominance = redChrominance;
        this.alpha = alpha;
    }

    /**
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
        const red = [], green = [], blue = [], alpha = [];

        // Itera os pixeis da imagem
        for(let r = 0; r < this.rowSize(); r++) {
            red[r] = [];
            green[r] = [];
            blue[r] = [];
            alpha[r] = [];

            for(let c = 0; c < this.columnSize(); c++) {
                // Converte para os pixeis RGB
                red[r][c] = 1 * this.luminance[r][c] + 0 * this.blueChrominance[r][c] + 1.13983 * this.redChrominance[r][c];
                green[r][c] = 1 * this.luminance[r][c] - 0.39465 * this.blueChrominance[r][c] - 0.58060 * this.redChrominance[r][c];
                blue[r][c] = 1 * this.luminance[r][c] + 2.03211 * this.blueChrominance[r][c];
                alpha[r][c] = this.alpha[r][c];
            }
        }

        return new RGB(red, green, blue, alpha);
    }

    drawLuminanceComponent() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;
     
        let i = 0;

        for(let r = 0; r < this.luminance.length; r++) {
            for(let c = 0; c < this.luminance[r].length; c++) {
                data[i] = this.luminance[r][c] / 0.299;    // RED
                data[i + 1] = this.luminance[r][c] / 0.587; // GREEN
                data[i + 2] = this.luminance[r][c] / 0.114; // BLUE
                data[i + 3] = this.alpha[r][c];

                //console.log("R: "+data[i]+"G: "+data[i+1]+"B: "+data[i+2]+"A: "+data[i+3]);

                i += 4;
            }
        } 

        context.putImageData(imgData, imageX, imageY);
    }

    drawBlueChrominanceComponent() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;
     
        for(var i=0, j=0, n = this.blueChrominance.length; j < n; i+=4, j++) {
            data[i] = this.blueChrominance[j] / -0.14713;        // RED
            data[i + 1] = this.blueChrominance[j] / -0.28886;    // GREEN
            data[i + 2] = this.blueChrominance[j] / 0.436;    // BLUE
            data[i + 3] = this.alpha[j];
        }
    
        context.putImageData(imgData, imageX, imageY);
    }

    drawRedChrominanceComponent() {
        let context = createCanvas();
    
        let imageX = 0;
        let imageY = 0;
    
        let imgData = context.createImageData(width, height);
        let data = imgData.data;
     
        for(var i=0, j=0, n = this.redChrominance.length; j < n; i+=4, j++) {
            data[i] = this.redChrominance[j] / 0.615;        // RED
            data[i + 1] = this.redChrominance[j] / -0.51499;    // GREEN
            data[i + 2] = this.redChrominance[j] / -0.10001;    // BLUE
            data[i + 3] = this.alpha[j];
        }
    
        context.putImageData(imgData, imageX, imageY);
    }

    rowSize() {
        return this.luminance.length;
    }

    columnSize() {
        return this.luminance[0].length;
    }
}