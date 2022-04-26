function jpeg_processing(encoded_image) {
    let category_array = [];
    let signal_error_array = [];

    for(let i = 0; i < encoded_image.length; i++) {
        category_array[i] = category_table(encoded_image[i]);
        signal_error_array[i] = encoded_image[i];
    }

    return [category_array, signal_error_array];
}

function category_table(signal_error) {
    if(signal_error == 0) {
        return 0;
    }else if(between_positive_or_negative(signal_error,1,1)) {
        return 1;
    }else if(between_positive_or_negative(signal_error,2,3)) {
        return 2;
    }else if(between_positive_or_negative(signal_error,4,7)) {
        return 3;
    }else if(between_positive_or_negative(signal_error,8,15)) {
        return 4;
    }else if(between_positive_or_negative(signal_error,16,31)) {
        return 5;
    }else if(between_positive_or_negative(signal_error,32,63)) {
        return 6;
    }else if(between_positive_or_negative(signal_error,64,127)) {
        return 7;
    }else if(between_positive_or_negative(signal_error,128,255)) {
        return 8;
    } 
}