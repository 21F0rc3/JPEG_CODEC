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
        for(var i = 0, n = this.red.length; i<n; i++) {
            //console.log(red + " " + green + " " + blue + " " + alpha);

            // Converte para os pixeis cromaticos
            let luminance = (0.299 * this.red[i]) + (0.587 * this.green[i]) + (0.114 * this.blue[i]);
            let blueChrominance = (-0.1687 * this.red[i]) + (-0.3313 * this.green[i]) + (0.5 * this.blue[i]) + 128;
            let redChrominance = (0.5 * this.red[i]) + (-0.4187 * this.green[i]) + (-0.0813 * this.blue[i]) + 128;

            // Adiciona aos arrays
            Y[i] = luminance;
            Cb[i] = blueChrominance;
            Cr[i] = redChrominance;
            A[i] = this.alpha[i];
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
     * @author Gabriel Fernandes 
     */
    toImageData() {
        const imageData = [];

        // Itera os pixeis da imagem
        for(var i = 0, j = 0, n = this.red.length; j<n; i+=4, j++) {
           imageData[i] = this.red[j];
           imageData[i + 1] = this.green[j];
           imageData[i + 2] = this.blue[j];
           imageData[i + 3] = this.alpha[j];
        }

        return new ImageData(imageData);
    }
}