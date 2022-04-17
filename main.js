/** Abre a imagem e começa o enconder */
let imageObj = new Image();
imageObj.onload = function() {
    startEncoder(this);
}
imageObj.src = "Horario.PNG";

/**
 * Função responsavel por comecar o processo de compressão
 * 
 * @param {Image} imageObj - Imagem que pretendemos codificar
 *
 * @author Gabriel Fernandes 16/04/2022
 */
function startEncoder(imageObj) {
    let context = drawImageFromImage(imageObj);
    let data = getImageDataFromImage(context);

    let chrominanceData = colorSpaceConversion(data);

    ChrominanceComponent.drawImage(chrominanceData);
    //chrominanceDownsampling(chrominanceData);
}

/**
 * Primeiro passo na compressão JPEG, obter dos valores RGB os
 * valores de Luminance(Y), Blue Chrominance(Cb) e Red Chrominance(Cr)
 * 
 * @param {ImageData} data - Dados dos pixeis da imagem
 * 
 * @returns Retorna um array com os dados cromaticos de cada pixel apos a conversão
 */
function colorSpaceConversion(data) {
    const chrominanceData = [];
    
    for(var i = 0, j = 0, n = width * height * 4; i<n; i+=4, j++) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 3];
        let alpha = data[i + 3];

        //console.log(red + " " + green + " " + blue + " " + alpha);

        let luminance = (0.299 * red) + (0.587 * green) + (0.114 * blue);
        let blueChrominance = (-0.1687 * red) + (-0.3313 * green) + (0.5 * blue) + 128;
        let redChrominance = (0.5 * red) + (-0.4187 * green) + (-0.0813 * blue) + 128;

        chrominanceData[j] = new ChrominanceComponent(luminance, blueChrominance, redChrominance, alpha);
    }

    return chrominanceData;
}

function chrominanceDownsampling(chrominanceData) {
    let blueChrominanceComponent = divideComponentImage(chrominanceData[1]);
    let redChrominanceComponent = divideComponentImage(chrominanceData[2]);
}

function divideComponentImage(chrominanceComponent) {
    const dividedChrominanceComponent = [];
    
    for(var i = 0, j = 0, n = chrominanceComponent.length; i < n; i+=4, j++) {
        divideComponentImage[j] = (chrominanceComponent[i] + chrominanceComponent[i + 1] + chrominanceComponent[i + 2] + chrominanceComponent[i + 3]) / 4; 
    }

    return dividedChrominanceComponent;
}

function rescaleComponentImage() {

}