import {Binary} from "../Objects/Binary.js"

function between_positive_or_negative(number, low, high) {
    if(number >= low && number <= high) {
        return true;
    }
    if(number >= -high && number <= -low) {
        return true;
    }

    return false;
}

export function convertToBinary(number) {
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

export function convertToDecimal(binaryNumber) {
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

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}