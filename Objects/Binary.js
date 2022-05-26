export class Binary {
    static convertDecimal(decimal) {
        // Array temporario para guardar o numero convertido
        let temp = [];
        let i = 0;
        let binaryData = "";

        decimal = Math.round(decimal);

        // Converte decimal para binario
        for(i = 0; decimal > 0; i++, decimal=decimal/2) { 
            temp[i] = Math.round(decimal%2);
            decimal -= temp[i]; 
        }  

        // Concatena o numero convertido
        for(i = i-1; i > 0; i--) {
            binaryData += temp[i];
        }

        //console.log("Decimal: "+decimal+"     Bit:"+binaryData);

        return binaryData;
    }

    static convertFloat(float) {
        let dec = Base(float);

        console.log("Float: "+float+"     Bit:"+dec.toBin().valueOf());

        return dec.toBin().valueOf();
    }
    
    static convertBinary(binary) {
        /*
        let decimal_num = 0;
        let base = 1
        let rem;  

        while (binary > 0) {  
            rem = binary % 10; /* divide the binary number by 10 and store the remainder in rem variable. */  
           /* decimal_num = decimal_num + rem * base;  
            binary = binary / 10; // divide the number with quotient  
            base = base * 2;  
        }*/
    }
}