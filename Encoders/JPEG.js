export function jpeg_processing(encoded_image) {
    let residual_category_array = [];

    for (let i = 0; i < encoded_image.length; i++) {
        residual_category_array[i] = getResidualCategory(encoded_image[i]);
       // console.log(encoded_image[i]+"    "+residual_category_array[i]);
    }

    //console.log(residual_category_array);

    return residual_category_array;
}

function getResidualCategory(residual) {
    if (residual == 0) {
        return 0;
    }
    if (residual == 2 ** 15) {
        return 16;
    }

    for (let i = 1; i < 16; i++) {
        const categoryUpperLimit = (2 ** i) - 1;
        const categoryLowerLimit = (2 ** (i - 1)) - 1;

        if ((residual >= -categoryUpperLimit && residual <= -categoryLowerLimit) || (residual <= categoryUpperLimit && residual >= categoryLowerLimit)) {
            return i;
        }
    }
}