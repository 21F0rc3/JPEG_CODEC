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
    let rgb_data = getImageDataFromImage(context);

    let chrominanceData = colorSpaceConversion(rgb_data);

    drawImageFromData((chrominanceData.toRGB()).toImageData());
    //ChrominanceComponent.drawImage(chrominanceData);
    
    //chrominanceDownsampling(chrominanceData);
}

/**
 * Primeiro passo na compressão JPEG, obter dos valores RGB os
 * valores de Luminance(Y), Blue Chrominance(Cb) e Red Chrominance(Cr)
 * 
 * @param {ImageData} data - Dados dos pixeis da imagem
 * 
 * @returns Retorna um array com os dados cromaticos de cada pixel apos a conversão
 *
 * @uthor Gabriel Fernandes 16/04/2022 
 */
function colorSpaceConversion(data) {
    return data.toChrominanceComponent();
}

/**
 * Segundo passo na compressão JPEG, pegar nos 2 componentes cromaticos e tornar cada 4 pixes (2x2) num 
 * unico pixel depois re-escalar esses 2 componentes reduzidos a 1/4 para o tamanho original, e unir 
 * dois esses 2 components ao component Luminance para formar uma nova imagem.
 * 
 * @param {*} chrominanceData - Array de ChrominanceComponent com os dados dos componentes cromaticos
 * 
 * @author Gabriel Fernandes 17/04/2022
 */
function chrominanceDownsampling(chrominanceData) {
    let blueChrominanceComponent = divideComponentImage(chrominanceData.blueChrominance);
    let redChrominanceComponent = divideComponentImage(chrominanceData.redChrominance);

    //console.log(chrominanceData.blueChrominance.length + " " + chrominanceData.alpha.length);

    blueChrominanceComponent = rescaleComponentImage(blueChrominanceComponent);
    redChrominanceComponent = rescaleComponentImage(redChrominanceComponent);

    let downsampledComponent = new ChrominanceComponent(chrominanceData.luminance, blueChrominanceComponent, redChrominanceComponent, chrominanceData.alpha); 
    
    ChrominanceComponent.drawImage(downsampledComponent);
    //console.log(blueChrominanceComponent.length + " " + chrominanceData.alpha.length);
}

/**
 * Pega no componente, e calcula a media de 4 pixeis(2x2) e torna num pixel.
 * 
 * @param {*} chrominanceData - Array de ChrominanceComponent com os dados dos componentes cromaticos
 * 
 * @returns component cromatico
 */
function divideComponentImage(chrominanceData) {
    const dividedChrominanceComponent = [];
    

    for(let i = 0, j = 0, n = chrominanceData.length; i < n; i+=4, j++) {
        dividedChrominanceComponent[j] = (chrominanceData[i] + chrominanceData[i + 1] + chrominanceData[i + 2] + chrominanceData[i + 3]) / 4; 
    }

    return dividedChrominanceComponent;
}

function rescaleComponentImage(chrominanceComponent) {
    const rescaledComponentImage = [];

    for(let i=0, j=0; j < chrominanceComponent.length; i+=4, j++) {
        rescaledComponentImage[i] = chrominanceComponent[j];
        rescaledComponentImage[i + 1] = chrominanceComponent[j];
        rescaledComponentImage[i + 2] = chrominanceComponent[j];
        rescaledComponentImage[i + 3] = chrominanceComponent[j];
    }

    return rescaledComponentImage;
}