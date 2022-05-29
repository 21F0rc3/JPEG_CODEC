import { width, height } from "../Utils/ImageUtils.js";

let PREDICTOR_TABLE_MODE = 0;

export function setPredictorMode(mode) {
    PREDICTOR_TABLE_MODE = mode;
}

/**
 * Differential pulse code modulation is a technique of analog to digital
 * signal conversion. This technique samples the analog signal and then
 * quantizes the difference between the sampled value and its predicted value,
 * then encodes the signal to form a digital value.
 *
 * @param {*} image - Image a ser codificada
 *
 * @returns Array 2D [signal_error]
 *
 * @author Gabriel Fernandes 25/04/2022
 */
export function dpcm_encode(data) {
    let residualArray = [];

    let sample_value = 0;
    let prediction_value = 0;
    let residual = 0;

    for (let i = 0; i < data.length; i++) {
        sample_value = data[i];

        // Valor baseado nos pixeis vizinhos
        prediction_value = predictPixel(data, i);

        // Diferença entre o valor previsto e o valor real
        residual = sample_value - prediction_value;

        // Pixel codificado.
        residualArray[i] = residual;
    }
    //console.log(residualArray);

    return residualArray;
}

export function dpcm_decode(data) {
    let decoded_data = [];
    let predictor = [];

    let sample_value = 0;
    let prediction_value = 0;
    let signal_error = 0;

    for (let i = 0; i < data.length; i++) {
        if(!data[i]) { // Se não existir é zero
            signal_error = 0;
        }else {
            signal_error = data[i];
        }

       //console.log(signal_error+"   "+prediction_value);
        prediction_value = predictPixel(predictor, i);

        sample_value = prediction_value + signal_error;

        decoded_data[i] = sample_value;

        predictor[i] = sample_value;
    }

    return decoded_data;
}

/**
 * Prevê um valor baseado nos pixeis vizinhos
 *
 * @param {*} encoded_data - imagem codificada
 * @param {*} index - indice da amostra
 *
 * @returns Valor previsto baseado nos pixeis vizinhos
 *
 * @author Gabriel Fernandes 25/04/2022
 */
function predictPixel(encoded_data, index) {
    let col = index;
    while(col >= width) {
        col -= width;
    }

    // Se o X estiver num dos limites da imagem, então os pixeis vizinhos terão de ser zero
    let A = col - 1 >= 0 ? encoded_data[index - 1] : 0;
    let B = index - width >= 0 ? encoded_data[index - width] : 0;
    let C = index - width - 1 >= 0 ? encoded_data[index - width - 1] : 0;

    //console.log("A: "+A+"  B: "+B+"   C: "+C+"    X: "+encoded_data[index]);

    return _getPredictionFromTable(A, B, C);
}

/**
 * Tabela de previsão
 *
 *    C | B
 *   ---|---
 *    A | X
 *
 * @param {*} A - Pixel vizinho
 * @param {*} B - Pixel vizinho
 * @param {*} C - Pixel vizinho
 *
 * @returns R - Valor previsto baseado nos pixeis vizinhos
 *
 * @author Gabriel Fernandes 25/04/2022
 */
function _getPredictionFromTable(A, B, C) {
    switch (PREDICTOR_TABLE_MODE) {
        case 0: {
            return 0;
        }
        case 1: {
            return A;
        }
        case 2: {
            return B;
        }
        case 3: {
            return C;
        }
        case 4: {
            return A + B - C;
        }
        case 5: {
            return A + (B - C) / 2;
        }
        case 6: {
            return B + (A - C) / 2;
        }
        case 7: {
            return (A + B) / 2;
        }
        default: {
            console.log("DPCM_encoder.predictor_table(): Mode " + PREDICTOR_TABLE_MODE + " não é um modo valido!");
            return null;
        }
    }
}