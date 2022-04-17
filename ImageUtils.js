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

function drawImageFromData(imageData) {
    let context = createCanvas();

    let imageX = 0;
    let imageY = 0;

    let imgData = context.createImageData(width, height);
    let data = imgData.data;

    console.log(imageData.length);

    for(var i=0, n = imageData.length * 4; i < n; i++) {
        data[i] = imageData[i];
    }

    context.putImageData(imgData, imageX, imageY);
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

    let red =[], green = [], blue = [], alpha = [];

    for(let i=0, j=0; j< data.length; i++, j+=4) {
        red[i] = data[j];
        green[i] = data[j + 1];
        blue[i] = data[j + 2];
        alpha[i] = data[j + 3];
    }

    return new RGB(red, green, blue, alpha);
}
