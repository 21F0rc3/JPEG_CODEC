import {drawImageFromImage, height, width} from "./Utils/ImageUtils.js"
import {ImageData} from "./Objects/ImageData.js"
import {dpcm_decode, dpcm_encode} from "./Encoders/DPCM.js";
import {jpeg_processing} from "./Encoders/JPEG.js";
import {huffmanTree} from "./Encoders/Huffman.js";
import {JPEG_Stream, JPEG_LS} from "./Objects/JPEG_Stream.js";
import {ChrominanceComponent} from "./Objects/ChrominanceComponent.js";
import { calculateAverageCodeLength, calculateCompressionRatio, getImageSize } from "./Utils/metricsUtils.js";

/** Abre a imagem e começa o enconder */
let imageObj = new Image();
imageObj.onload = function () {
    main(this);
}
//imageObj.src = "Horario.PNG";
imageObj.src = "Horario.PNG";


var startButton = document.getElementById("start");

startButton.onclick = function() {
    main();
}

function main() {
    // Vai buscar os dados da imagem que foi enviada
    //let imageObj = new Image();
    //imageObj = document.getElementById('sourceImage');

    // Imagem original
    let context = drawImageFromImage(imageObj);

    const sourceImageData = ImageData.getImageDataFromImage(context)

    // Tamanho da imagem original
    let inputImageSize = getImageSize(sourceImageData.data);
    console.log(inputImageSize);

    /*
    console.log("original luminance", {
        Y: sourceChrominanceComponent.luminance,
        Cr: sourceChrominanceComponent.redChrominance,
        Cb: sourceChrominanceComponent.blueChrominance
    });*/

    /////////////////////////////
    //      COMPRESSÃO         //
    /////////////////////////////

    // Converte para Components cromaticos
    let sourceChrominanceComponent = sourceImageData.toRGB().toChrominanceComponent();
    
    // Desenha os tres componentes
    sourceChrominanceComponent.drawLuminanceComponent();
    sourceChrominanceComponent.drawRedChrominanceComponent();
    sourceChrominanceComponent.drawBlueChrominanceComponent();

    // Cronometra o tempo de compressão
    let startCompressTime = new Date();

    let compressedImageData = compress(sourceChrominanceComponent)
    
    // Cronometra o tempo de compressão
    let endCompressTime = new Date();

    console.log("compressed luminance", {
        Y: sourceChrominanceComponent.luminance,
        Cr: sourceChrominanceComponent.redChrominance,
        Cb: sourceChrominanceComponent.blueChrominance
    });
    console.log("compressed data", {encodedImage: compressedImageData.compressedData})
    
    sourceChrominanceComponent.toRGB().toImageData().drawImage();

    // Tamanho da imagem comprimida
    let outputImageSize = compressedImageData.compressedData.luminance.compressedData.length+
                          compressedImageData.compressedData.blueChrominance.compressedData.length+
                          compressedImageData.compressedData.redChrominance.compressedData.length;
    //console.log(outputImageSize);

    //////////////////////////////
    //      DESCOMPRESSÃO       //
    //////////////////////////////

    // Cronometra o tempo de descompressão
    let startDecompressTime = new Date();

    let decompressedImageData = decompress(compressedImageData);

    // Cronometra o tempo de descompressão
    let endDecompressTime = new Date();

    //console.log(decompressedImageData);

    decompressedImageData.toRGB().toImageData().drawImage();


    //////////////////////////////
    //         Metricas         //
    //////////////////////////////

    calculateCompressionRatio(inputImageSize, outputImageSize);
    calculateAverageCodeLength(compressedImageData.compressedData.luminance, compressedImageData.compressedData.blueChrominance, compressedImageData.compressedData.redChrominance);
    
    var startTimeStamp = startCompressTime.getFullYear()+'-'+(startCompressTime.getMonth()+1)+'-'+startCompressTime.getDate()+'  '+ startCompressTime.getHours() + ":" + startCompressTime.getMinutes() + ":" + startCompressTime.getSeconds();
    var endTimeStamp = endCompressTime.getFullYear()+'-'+(endCompressTime.getMonth()+1)+'-'+ endCompressTime.getDate()+'  '+ endCompressTime.getHours() + ":" + endCompressTime.getMinutes() + ":" + endCompressTime.getSeconds();
    //console.log(startTimeStamp);
    //console.log(endTimeStamp);

    // Compression Time
    console.log("Compression Time: "+(endCompressTime.getSeconds() - startCompressTime.getSeconds())+" sec");

    // Decompression Time
    console.log("Decompression Time: "+(endDecompressTime.getSeconds() - startDecompressTime.getSeconds())+" sec");
}

/**
 *
 * @param source_image {ChrominanceComponent}
 * @return {JPEG_LS}
 */
function compress(source_image) {
    return JPEG_LS.compress(source_image);
}

function decompress(compressedImage) {
    return JPEG_LS.decompress(compressedImage);
}