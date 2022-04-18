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
class ImageData {
    constructor(data = []) {
        this.data = data;
    } 

    /**
     * Pega numa imagem e obtem os dados dos pixeis e coloca num array
     * 
     * @param {*} context - Contexto do canvas onde esta a imagem
     * 
     * @returns um Objeto ImageData que possui o array de pixeis com a 
     * informação da imagem
     * 
     * @author Gabriel Fernandes 18/04/2022 
     */
    static getImageDataFromImage(context) {
        let imageData = context.getImageData(0, 0, width, height);
        let data = imageData.data;
    
        return new ImageData(data);
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
    
        console.log(this.data.length);
    
        for(var i=0, n = this.data.length * 4; i < n; i++) {
            data[i] = this.data[i];
        }
    
        context.putImageData(imgData, imageX, imageY);
    }

    /**
     * Converte um objeto ImageData para um Objeto RGB
     * 
     * Ao inves de termos um array em que cada 4 indices
     * representam 1 pixel, temos 4 arrays diferentes para cada cor(e o alpha)
     * 
     * @returns Novo objeto RGB com as informações da imagem
     * 
     * @author Gabriel Fernandes 18/04/2022 
     */
    toRGB() {
        let red =[], green = [], blue = [], alpha = [];
    
        for(let i=0, j=0; j< this.data.length; i++, j+=4) {
            red[i] = this.data[j];
            green[i] = this.data[j + 1];
            blue[i] = this.data[j + 2];
            alpha[i] = this.data[j + 3];
        }
    
        return new RGB(red, green, blue, alpha);
    }
}