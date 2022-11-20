export const width = 800;
export const height = 400;


export function createCanvas() {
    let canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 8;
    
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    let context = canvas.getContext('2d');

    return context;
}

export function drawImageFromImage(imageObj) {
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

    return context.getImageData(0, 0, width, height).data;
}