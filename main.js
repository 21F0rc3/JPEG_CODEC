import {drawImageFromImage, height, width} from "./Utils/ImageUtils.js"
import {ImageData} from "./Objects/ImageData.js"
import {dpcm_decode, dpcm_encode} from "./Encoders/DPCM.js";
import {jpeg_processing} from "./Encoders/JPEG.js";
import {huffmanTree} from "./Encoders/Huffman.js";
import {JPEG_Stream, JPEG_LS} from "./Objects/JPEG_Stream.js";
import {ChrominanceComponent} from "./Objects/ChrominanceComponent.js";

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

    let compressedImageData = compress(sourceChrominanceComponent)
    
    console.log("compressed luminance", {
        Y: sourceChrominanceComponent.luminance,
        Cr: sourceChrominanceComponent.redChrominance,
        Cb: sourceChrominanceComponent.blueChrominance
    });
    console.log("compressed data", {encodedImage: compressedImageData.compressedData})
    
    sourceChrominanceComponent.toRGB().toImageData().drawImage();

    //////////////////////////////
    //      DESCOMPRESSÃO       //
    //////////////////////////////

    let decompressedImageData = decompress(compressedImageData);

    //console.log(decompressedImageData);

    decompressedImageData.toRGB().toImageData().drawImage();
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