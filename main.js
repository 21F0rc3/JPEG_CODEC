import { setPredictorMode } from "./Encoders/DPCM.js";
import {ImageData} from "./Objects/ImageData.js"
import { JPEG_LS} from "./Objects/JPEG_Stream.js";
import {ChrominanceComponent} from "./Objects/ChrominanceComponent.js";
import {drawImageFromImage} from "../Utils/ImageUtils.js";
import { calculateAverageCodeLength, calculateCompressionRatio, getImageSize } from "./Utils/metricsUtils.js";

var startButton = document.getElementById("start");

let sourceChrominanceComponents, decompressedImageData, compressedImageData, sourceImageData;

startButton.onclick = function() {
    //clear();
    setPredictorMode(parseInt(document.getElementById("predictor_mode").value));
    main();
}

function convertUploadedImageToImageData() {
    // Vai buscar os dados da imagem que foi enviada
    let imageObj = document.getElementById('sourceImage');

    // Imagem original
    let imageData = drawImageFromImage(imageObj);

    return new ImageData(imageData);
}


function main() {
    sourceImageData = convertUploadedImageToImageData();

    /////////////////////////////
    //      COMPRESSÃO         //
    /////////////////////////////

    let compressTime = new Date();

    compressedImageData = compress(sourceImageData);

    compressTime = compressTime.getSeconds() - new Date().getSeconds();

    //////////////////////////////
    //      DESCOMPRESSÃO       //
    //////////////////////////////

    let decompressTime = new Date();

    decompressedImageData = decompress(compressedImageData);

    decompressTime = decompressTime.getSeconds() - new Date().getSeconds();

    //////////////////////////////
    //         Desenha          //
    //////////////////////////////
    drawCompressionSteps();

    //////////////////////////////
    //         Metricas         //
    //////////////////////////////
    calculateMetrics(compressTime, decompressTime);
}

function drawCompressionSteps() {
    // Desenha os tres componentes
    sourceChrominanceComponents.drawLuminanceComponent();
    sourceChrominanceComponents.drawRedChrominanceComponent();
    sourceChrominanceComponents.drawBlueChrominanceComponent();

    sourceChrominanceComponents.toRGB().toImageData().drawImage();

    decompressedImageData.toRGB().toImageData().drawImage();
}

/**
 *
 * @param source_image {ChrominanceComponent}
 * @return {JPEG_LS}
 */
function compress(sourceImageData) {
    // Converte para Components cromaticos
    sourceChrominanceComponents = sourceImageData.toRGB().toChrominanceComponent();
    return JPEG_LS.compress(sourceChrominanceComponents);
}

function decompress(compressedImageData) {
    return JPEG_LS.decompress(compressedImageData);
}

function calculateMetrics(compressTime, decompressTime) {
    // Tamanho da imagem original
    let inputImageSize = getImageSize(sourceImageData.data);

    // Tamanho da imagem comprimida
    let outputImageSize = compressedImageData.compressedData.luminance.compressedData.length+
                          compressedImageData.compressedData.blueChrominance.compressedData.length+
                          compressedImageData.compressedData.redChrominance.compressedData.length;

    let CR = calculateCompressionRatio(inputImageSize, outputImageSize);
    let ACL = calculateAverageCodeLength(compressedImageData.compressedData.luminance, compressedImageData.compressedData.blueChrominance, compressedImageData.compressedData.redChrominance);

    let div = document.createElement("div");

    let p1 = document.createElement("p");
    p1.innerHTML = "Compresion Ratio: "+Math.floor(1/CR)+":1 ("+CR+")";

    let p2 = document.createElement("p");
    p2.innerHTML = "Average Code Length: "+ACL;

    let p3 = document.createElement("p");
    p3.innerHTML = "Coding Time: "+compressTime;
    
    let p4 = document.createElement("p");
    p4.innerHTML = "Decoding Time: "+decompressTime;

    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(p4);

    document.body.appendChild(div);
}