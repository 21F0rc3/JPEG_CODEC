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
imageObj.src = "Horario.PNG";

function main(imageObj) {
    // Imagem original
    let context = drawImageFromImage(imageObj);

    const sourceImageData = ImageData.getImageDataFromImage(context)
    let sourceChrominanceComponent = sourceImageData.toRGB().toChrominanceComponent();

    console.log("original luminance", {
        Y: sourceChrominanceComponent.luminance,
        Cr: sourceChrominanceComponent.redChrominance,
        Cb: sourceChrominanceComponent.blueChrominance
    });

    /////////////////////////////
    //      COMPRESSÃO         //
    /////////////////////////////

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

    decompress(compressedImageData);
    console.log("decompressed luminance", {
        Y: sourceChrominanceComponent.luminance,
        Cr: sourceChrominanceComponent.redChrominance,
        Cb: sourceChrominanceComponent.blueChrominance
    });

    sourceChrominanceComponent.toRGB().toImageData().drawImage();
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
    JPEG_LS.decompress(compressedImage);
}