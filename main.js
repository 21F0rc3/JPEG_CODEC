/** Abre a imagem e começa o enconder */
let imageObj = new Image();
imageObj.onload = function() {
    main(this);
}
imageObj.src = "Horario.PNG";

function main(imageObj) {
    startEncoder(imageObj);
}