/**
 * Classe reponsavel pelos Componentes chromiuns
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
    constructor(luminance, blueChrominance, redChrominance, alpha) {
        this.luminance = luminance;
        this.blueChrominance = blueChrominance;
        this.redChrominance = redChrominance;
        this.alpha = alpha;
    }

    /**
     * Metodo responsavel por desenhar os 3 componentes cromaticos(para podermos vizualizar cada um deles) 
     * 
     * @warning Este metodo ainda não esta pronto, eu não sei como desenhar cada um deles ainda.
     * Isto é so uma ideia e não a função final.
     * 
     * @param {} chrominanceData - Array com todos os objetos ChrominanceComponent que possuem a informacao cromatica convertida
     * da imagem RGB
     * 
     * @author Gabriel Fernandes 17/04/2022 
     */
    static drawImage(chrominanceData) {
        for(let component = 0; component < 3; component++) {
            let context = createCanvas();

            let imageX = 0;
            let imageY = 0;

            let imgData = context.createImageData(width, height);
            let data = imgData.data;

            for(var i=0, j=0, n = width * height * 4; i < n; i+=4, j++) {
                data[i] = component == 0 ? chrominanceData[j].redChrominance : 0;
                data[i + 1] = component == 1 ? chrominanceData[j].luminance : 0;
                data[i + 2] = component == 2 ? chrominanceData[j].blueChrominance : 0; 
                data[i + 3] = chrominanceData[j].alpha;
            }
    
            context.putImageData(imgData, imageX, imageY);
        }
    }

    toString() {
        console.log(this.luminance + " " + this.blueChrominance + " " + this.redChrominance + " " + this.alpha);
    }
}