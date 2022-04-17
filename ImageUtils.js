class rgba {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}


const width = 200;
const height = 100;


function createCanvas() {
    let canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 8;
    
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    let context = canvas.getContext('2d');

    return context;
}


function drawImageFromImage(imageObj) {
    let canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 8;
    
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    let context = canvas.getContext('2d');
    let imageX = 0;
    let imageY = 0;

    context.drawImage(imageObj, imageX, imageY);

    return context;
}

function getImageDataFromImage(context) {
    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;

    return data;
}
