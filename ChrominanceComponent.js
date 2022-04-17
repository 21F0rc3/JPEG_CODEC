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
    constructor(luminance = [], blueChrominance = [], redChrominance = [], alpha = []) {
        this.luminance = luminance;
        this.blueChrominance = blueChrominance;
        this.redChrominance = redChrominance;
        this.alpha = alpha;
    }

    toRGB() {
        const red = [], green = [], blue = [], alpha = [];

        // Itera os pixeis da imagem
        for(let i = 0, n = this.luminance.length; i<n; i++) {
            //console.log(red + " " + green + " " + blue + " " + alpha);

            // Converte para os pixeis RGB
            red[i] = 172.4496969 * this.luminance[i];
            green[i] = -135.4517891 * this.blueChrominance[i];
            blue[i] = 226.79599723 * this.redChrominance[i];
            alpha[i] = this.alpha[i];
        }

        return new RGB(red, green, blue, alpha);
    }
}