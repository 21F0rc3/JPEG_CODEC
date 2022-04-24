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
 * @author Gabriel Fernandes 18/04/2022
 */
class RGB{
    constructor(red = [], green = [], blue = [], alpha = []) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
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
        const Y = [], Cb = [], Cr = [], A = [];

        // Itera os pixeis da imagem
        for(let r = 0; r < this.red.length; r++) {
            Y[r] = [];
            Cb[r] = [];
            Cr[r] = [];
            A[r] = [];

            for(let c = 0; c < this.red[r].length; c++) {
                // Converte para os pixeis cromaticos
                let luminance = (0.299 * this.red[r][c]) + (0.587 * this.green[r][c]) + (0.114 * this.blue[r][c]);
                let blueChrominance = (-0.14713 * this.red[r][c]) + (-0.28886 * this.green[r][c]) + (0.436 * this.blue[r][c]);
                let redChrominance = (0.615 * this.red[r][c]) + (-0.51499 * this.green[r][c]) + (-0.10001 * this.blue[r][c]);

                // Adiciona aos arrays
                Y[r][c] = luminance;
                Cb[r][c] = blueChrominance;
                Cr[r][c] = redChrominance;
                A[r][c] = this.alpha[r][c];
            }
        }

        return new ChrominanceComponent(Y,Cb,Cr,A);
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

        let i=0;

        // Itera os pixeis da imagem
        for(let r = 0; r < this.red.length; r++) {
            for(let c = 0; c < this.red[r].length; c++) {
                imageData[i] = this.red[r][c];
                imageData[i + 1] = this.green[r][c];
                imageData[i + 2] = this.blue[r][c];
                imageData[i + 3] = this.alpha[r][c];

                i+=4;
            }
        }

        return new ImageData(imageData);
    }

    rowSize() {
        return this.red.length;
    }

    columnSize() {
        return this.red[0].length;
    }
}