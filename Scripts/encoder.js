/**
 * Função responsavel por comecar o processo de compressão
 * 
 * @param {Image} imageObj - Imagem que pretendemos codificar
 *
 * @author Gabriel Fernandes 16/04/2022
 */
 function startEncoder(imageObj) {
    // Imagem original
    let context = drawImageFromImage(imageObj);
    let rgb_data = ImageData.getImageDataFromImage(context).toRGB();

    let chrominanceData = colorSpaceConversion(rgb_data);
    
    // Resultado após o ColorSpaceConversion
    chrominanceData.drawLuminanceComponent();
    chrominanceData.drawBlueChrominanceComponent();
    chrominanceData.drawRedChrominanceComponent();

    let downsampledComponent = chrominanceDownsampling(chrominanceData);

    // Resultado final apos o chrominance downsampling
    downsampledComponent.toRGB().toImageData().drawImage();
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
    
    return downsampledComponent;
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

/**
 * Pega no componente dividido 1/4, e aumenta os pixeis de modo a este ter
 * o tamanho original 1
 * 
 * @param {} chrominanceComponent - Componente cromatico dividido
 * 
 * @returns Componente cromatico na escala 1:1 
 */
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