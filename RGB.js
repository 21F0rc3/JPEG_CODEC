class RGB{
    constructor(red = [], green = [], blue = [], alpha = []) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toChrominanceComponent() {
        const Y = [], Cb = [], Cr = [], A = [];

        // Itera os pixeis da imagem
        for(var i = 0, n = this.red.length; i<n; i++) {
            //console.log(red + " " + green + " " + blue + " " + alpha);

            // Converte para os pixeis cromaticos
            let luminance = (0.299 * this.red[i]) + (0.587 * this.green[i]) + (0.114 * this.blue[i]);
            let blueChrominance = (-0.1687 * this.red[i]) + (-0.3313 * this.green[i]) + (0.5 * this.blue[i]) + 128;
            let redChrominance = (0.5 * this.red[i]) + (-0.4187 * this.green[i]) + (-0.0813 * this.blue[i]) + 128;

            // Adiciona aos arrays
            Y[i] = luminance;
            Cb[i] = blueChrominance;
            Cr[i] = redChrominance;
            A[i] = this.alpha[i];
        }

        return new ChrominanceComponent(Y,Cb,Cr,A);
    }

    toImageData() {
        const imageData = [];

        // Itera os pixeis da imagem
        for(var i = 0, j = 0, n = this.red.length; j<n; i+=4, j++) {
           imageData[i] = this.red[j];
           imageData[i + 1] = this.green[j];
           imageData[i + 2] = this.blue[j];
           imageData[i + 3] = this.alpha[j];
        }

        return imageData;
    }
}