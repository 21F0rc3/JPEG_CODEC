import {Binary} from "./Binary.js";
import {dpcm_decode, dpcm_encode} from "../Encoders/DPCM.js";
import {jpeg_processing} from "../Encoders/JPEG.js";
import {huffmanTree} from "../Encoders/Huffman.js";
import {drawImageFromImage, height, width} from "../Utils/ImageUtils.js";
import {ChrominanceComponent} from "./ChrominanceComponent.js";

export class JPEG_Stream {
    constructor(width, heigth, huffman_map, jpeg_stream) {
        this.width = width;
        this.heigth = heigth;
        this.huffman_map = huffman_map;
        this.jpeg_stream = jpeg_stream;
    }

    static create(width, heigth, category_array, signal_error_array, huffman_map) {
        let compressedData = "";

        // Concatenar a categoria codificada em huffman e o signal_error
        for (let i = 0; i < category_array.length; i++) {
            let huffman_bits = huffman_map[category_array[i]];
            let signal_error_bits = Binary.convertDecimal(signal_error_array[i]);

            compressedData += (huffman_bits + "" + signal_error_bits);
        }

        return new JPEG_Stream(width, heigth, huffman_map, compressedData);
    }

    decodeImage() {
        let index = 0;

        let signal_error_array = [];

        let huffman_bits = "";
        let signal_error_bits = "";

        for (let i = 0; i < (this.width * this.heigth); i++) {
            huffman_bits += this.jpeg_stream[i];

            let huffman_number = this.checkMapMatch(huffman_bits);

            // console.log(huffman_bits);

            /* Se houve uma match então lé os seguintes huffman_number bits da 
            sequencia pois constituem o valor do signal_error */
            if (huffman_number != -1) {
                for (let j = 0; j < huffman_number; j++, i++) {
                    signal_error_bits += this.jpeg_stream[i];
                }

                signal_error_array[index++] = Binary.convertBinary(signal_error_bits);

                huffman_bits = "";
                signal_error_bits = "";
            }
        }

        //console.log(signal_error_array);

        return signal_error_array;
    }

    checkMapMatch(huffman_bits) {
        //console.log(this.huffman_map.length);
        for (let i = 0; i < 32; i++) {
            if (huffman_bits == this.huffman_map[i]) {
                return i;
            }
        }

        return -1;
    }
}

export class JPEG_LS {
    /**
     *
     * @param width {number}
     * @param height {number}
     * @param compressedData {CompressedData}
     * @param sourceChrominanceComponent {ChrominanceComponent}
     */
    constructor(width, height, compressedData, sourceChrominanceComponent) {
        this.width = width;
        this.heigth = height;
        this.compressedData = compressedData;
        this.sourceChrominanceComponent = sourceChrominanceComponent;
    }

    /**
     *
     * @param sourceChrominanceComponent {ChrominanceComponent}
     * @return {JPEG_LS}
     */
    static compress(sourceChrominanceComponent) {
        let compressedLuminance = compressComponent(sourceChrominanceComponent.luminance)
        let compressedCb = compressComponent(sourceChrominanceComponent.blueChrominance)
        let compressedCr = compressComponent(sourceChrominanceComponent.redChrominance)

        let compressedImage = new JPEG_LS(width, height, {
            luminance: compressedLuminance,
            redChrominance: compressedCr,
            blueChrominance: compressedCb
        }, sourceChrominanceComponent);

        compressedImage.setComponents(compressedLuminance.residualArray, compressedCr.residualArray, compressedCb.residualArray);

        return compressedImage;
    }

    /**
     * @param compressedImage {JPEG_LS}
     * */
    static decompress(compressedImage) {
        let compressedData = compressedImage.compressedData;

        let decompressedLuminance = decompressComponent(compressedData.luminance);
        let decompressedCb = decompressComponent(compressedData.blueChrominance);
        let decompressedCr = decompressComponent(compressedData.redChrominance);

        let decompressedImage = new ChrominanceComponent(width, height, decompressedLuminance, decompressedCb, decompressedCr, compressedImage.sourceChrominanceComponent.alpha);

        return decompressedImage;
    }

    /**
     *
     * @param luminance {number[]}
     * @param redChrominance {number[]}
     * @param blueChrominance {number[]}
     */
    setComponents(luminance, redChrominance, blueChrominance) {
        this.sourceChrominanceComponent.luminance = luminance;
        this.sourceChrominanceComponent.redChrominance = redChrominance;
        this.sourceChrominanceComponent.blueChrominance = blueChrominance;
    }
}

class CompressedComponent {
    constructor(compressedData, huffmanMap, residualArray) {
        this.compressedData = compressedData;
        this.huffmanMap = huffmanMap;
        this.residualArray = residualArray;
    }
}

class CompressedData {
    constructor(compressedLuminance, compressedCr, compressedCb) {
        this.luminance = compressedLuminance;
        this.blueChrominance = compressedCb;
        this.redChrominance = compressedCr;
    }
}

/**
 *
 * @param originalComponent {number[]}
 * @return {CompressedComponent}
 */
function compressComponent(originalComponent) {
    // DPCM
    let residualArray = dpcm_encode(originalComponent);

   // Processamento JPEG
    let residualCategories = jpeg_processing(residualArray);

    //Passa so o array de categorias e codifica por Huffman
    let huffmanResidualCategories = new huffmanTree(residualCategories);
    let huffmanMap = huffmanResidualCategories.getHuffmanCode(huffmanResidualCategories.huffmanTree);

    let compressedData = "";

    for (let i = 0; i < residualCategories.length; i++) {
        let key = residualCategories[i];

        if(key == 0) { // Se for zero não colocamos nem sequer um bit
        //    console.log(residualArray[i]+"    "+huffmanMap.get(key.toString()));
            compressedData += huffmanMap.get(key.toString());
        }else {
        //    console.log(residualArray[i]+"    "+huffmanMap.get(key.toString()) + convertToBinary(residualArray[i]));
            compressedData += huffmanMap.get(key.toString()) + convertToBinary(residualArray[i]);
        }
    }

    return {compressedData: compressedData, huffmanMap: huffmanMap, residualArray: residualArray};
}

function convertToBinary(number) {
    let binaryNumber;

    if(number < 0) { // Se for negativo faz complemento
        binaryNumber = dec2bin(Math.abs(number));
        let bitsSteam = "";

        for(let i=0; i<binaryNumber.length; i++) {
            if(binaryNumber[i] == 1) {
                bitsSteam += '0';
            }else{
                bitsSteam += '1';
            }
        }

        binaryNumber = bitsSteam;
    }else {
        binaryNumber = dec2bin(number);
    }

    return binaryNumber;
}

function convertToDecimal(binaryNumber) {
    let isNegativeNumber = false;

    if(binaryNumber[0] == 0) { // Se o primeiro numero for 0, e um numero com complemento
        let bitStream = "";
        isNegativeNumber = true;

        for(let i=0; i<binaryNumber.length; i++) {
            if(binaryNumber[i] == 0) {
                bitStream += '1';
            }else{
                bitStream += '0';
            }
        }

        binaryNumber = bitStream;
    }

    let decimalNumber = parseInt(binaryNumber, 2);

    //console.log(decimalNumber);

    return isNegativeNumber == true ? -decimalNumber : decimalNumber;
}

/**
 *
 * @param compressedComponent {CompressedComponent}
 * @return {number[]}
 */
function decompressComponent(compressedComponent) {
    let decompressedData = [];

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
            //console.log(residualCategory +"     "+currentResidualElement);
            decompressedData.push(convertToDecimal(currentResidualElement));

            currentResidualElement = "";
            currentTryForHuffman = "";
        }
    }

    //console.log(decompressedData);
    
    // Descomprime no codificador diferencial 
    return dpcm_decode(compressedComponent.residualArray);
}

/**
 * @param map {Map}
 * @param iValue {string}
 *
 * @return {number}
 * */
function getMapKey(map, iValue) {
    let mapKeys = [...map.keys()];
    for (let i = 0; map.size; i++) {
        if (map.get(mapKeys[i]) == iValue) {
            return mapKeys[i];
        }
    }

    return -1;
}

function decodeImage() {
    let index = 0;

    let signal_error_array = [];

    let huffman_bits = "";
    let signal_error_bits = "";

    for (let i = 0; i < (this.width * this.heigth); i++) {
        huffman_bits += this.jpeg_stream[i];

        let huffman_number = this.checkMapMatch(huffman_bits);

        // console.log(huffman_bits);

        /* Se houve uma match então lé os seguintes huffman_number bits da
        sequencia pois constituem o valor do signal_error */
        if (huffman_number != -1) {
            for (let j = 0; j < huffman_number; j++, i++) {
                signal_error_bits += this.jpeg_stream[i];
            }

            signal_error_array[index++] = parseInt(signal_error_bits, 2);

            huffman_bits = "";
            signal_error_bits = "";
        }
    }

    //console.log(signal_error_array);

    return signal_error_array;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}