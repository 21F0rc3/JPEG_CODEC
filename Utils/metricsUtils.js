import {drawImageFromImage, height, width} from "./ImageUtils.js"
import {convertToBinary, convertToDecimal} from "./mathUtils.js"
import {getMapKey} from "../Objects/JPEG_Stream.js";

export function getImageSize(image) {
    let size = 0;

    for(let i=0; i<image.length; i++) {
        size += convertToBinary(image[i]).length;
    }
    
    return size;
}

export function calculateCompressionRatio(inputImageSize, outputImageSize) {
    let compressionRatio = outputImageSize / inputImageSize;
    
    console.log(compressionRatio);
    console.log("Compression Ratio -> "+Math.floor(1/compressionRatio)+":1");
}

export function calculateAverageCodeLength(luminanceCompressedData, blueChrominanceCompressedData, redChrominanceCompressedData) {
    let x =  calculateNrOfSymbol(luminanceCompressedData);
    let y =  calculateNrOfSymbol(blueChrominanceCompressedData);
    let z = calculateNrOfSymbol(redChrominanceCompressedData);

    let totalBits = luminanceCompressedData.compressedData.length + blueChrominanceCompressedData.compressedData.length + redChrominanceCompressedData.compressedData.length;

    let ACL = totalBits / (x + y + z);

    console.log("Average Code Length ->"+ACL+" bits per symbol");

    return ACL;
}

function calculateNrOfSymbol(compressedComponent) {
    let SymbolNo = 0;

    // 1. Pegar os dados comprimidos e concatenados
    /** @type {string} */
    let compressedData = compressedComponent.compressedData;

    // 2. Pegar a tabela de huffman da imagem
    /** @type {Map} */
    let huffmanMap = compressedComponent.huffmanMap;
    const huffmanMapValues = [...huffmanMap.values()];

    // 3.1 Procurar nos dados comprimidos por codificacoes do mapa
    let currentTryForHuffman = "";
    let currentResidualElement = "";
    for (let i = 0; i < compressedData.length; i++) {
        currentTryForHuffman += compressedData[i];

        // 3.2 Ao encontrar os codificadores, descodificar o pixel
        if (huffmanMapValues.includes(currentTryForHuffman)) {
            const residualCategory = getMapKey(huffmanMap, currentTryForHuffman);
            for (let j = 0; j < residualCategory; j++) {
                currentResidualElement += compressedData[++i];
            }

            SymbolNo++;

            currentResidualElement = "";
            currentTryForHuffman = "";
        }
    }

    console.log(SymbolNo);
    return SymbolNo;
}