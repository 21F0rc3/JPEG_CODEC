class JPEG_Stream {
    constructor(width, heigth, huffman_map, jpeg_stream) {
        this.width = width;
        this.heigth = heigth;
        this.huffman_map = huffman_map;
        this.jpeg_stream = jpeg_stream;
    }

    static create(width, heigth, category_array, signal_error_array, huffman_map) {
        let jpeg_final_stream = "";
        
        // Concatenar a categoria codificada em huffman e o signal_error
        for(let i = 0; i < category_array.length; i++) {
            let huffman_bits = huffman_map[category_array[i]];
            let signal_error_bits = Binary.convertDecimal(signal_error_array[i]);

            jpeg_final_stream += (huffman_bits+""+signal_error_bits);
        }

        return new JPEG_Stream(width, heigth, huffman_map, jpeg_final_stream);
    }

    decode() {
        let index = 0;

        let signal_error_array = [];

        let huffman_bits = "";
        let signal_error_bits = "";

        for(let i = 0; i < (this.width * this.heigth); i++) {
            huffman_bits += this.jpeg_stream[i];

            let huffman_number = this.checkMapMatch(huffman_bits);

           // console.log(huffman_bits);

            /* Se houve uma match então lé os seguintes huffman_number bits da 
            sequencia pois constituem o valor do signal_error */
            if(huffman_number != -1) {
                for(let j = 0; j<huffman_number; j++, i++) {
                   signal_error_bits += this.jpeg_stream[i];    
                }

                signal_error_array[index++] = Binary.convertBinary(signal_error_bits);

                huffman_bits = "";
                signal_error_bits = "";
            }
        }

        console.log(signal_error_array);

        return signal_error_array;
    }

    checkMapMatch(huffman_bits) {
        console.log(this.huffman_map.length);
        for(let i = 0; i < 32; i++) {
            if(huffman_bits == this.huffman_map[i]) {
                return i;
            }
        }

        return -1;
    }
}