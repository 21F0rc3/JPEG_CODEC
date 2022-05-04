/** Abre a imagem e começa o enconder */
let imageObj = new Image();
imageObj.onload = function() {
    main(this);
}
imageObj.src = "Horario.PNG";

function main(imageObj) {
    // Imagem original
    let context = drawImageFromImage(imageObj);
    
    let source_image = ImageData.getImageDataFromImage(context).toRGB().toChrominanceComponent();

    /////////////////////////////
    //      COMPRESSÃO         //
    /////////////////////////////

    // Codifica por DPCM
    let residual_data = dpcm_encode(source_image.luminance);
    
    // Processamento JPEG
    let processingResults = jpeg_processing(residual_data);

    let category_array = processingResults.categories;
    let signal_error_array = processingResults.residuals;

    //Passa so o array de categorias e codifica por Huffman
    let Huffman_encoding = new huffmanTree(category_array);
    let map = Huffman_encoding.getHuffmanCode(Huffman_encoding.huffmanTree);

    let JPEG_IMAGE = JPEG_Stream.create(width, height, category_array, signal_error_array, map); 
    
    //console.log(JPEG_IMAGE.jpeg_stream);

    //////////////////////////////
    //      DESCOMPRESSÃO       //
    //////////////////////////////

    let decoded_jpeg_image = JPEG_IMAGE.decode();
    
    let decoded_image = dpcm_decode(decoded_jpeg_image);

    source_image.luminance = decoded_image;

    source_image.toRGB().toImageData().drawImage();
}