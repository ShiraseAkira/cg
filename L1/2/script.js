const ORANGE = "#FFA500";
const BLUE = "#7777FF";
const GREEN = "#77FF77";

let canvas, context;
let isDragging = false;
let posX, posY;

function drawImage() {
    context.fillStyle = ORANGE;
    context.fillRect(0, 0, 100, 100)
    context.fillStyle = BLUE;
    context.fillRect(-50, -50, 100, 100);  
}

function redraw() {
    context.save();
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    drawImage();
}

window.addEventListener("load", () => {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.addEventListener('mousedown', (e) => {
        posX = e.offsetX;
        posY = e.offsetY;
        
        isDragging = true;
    });

    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseout', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
        if(isDragging) {
            let deltaX = e.offsetX - posX;
            let deltaY = e.offsetY - posY;
            context.translate(deltaX, deltaY);
            posX += deltaX;
            posY += deltaY;

            window.requestAnimationFrame(redraw);
        }
    });

    window.requestAnimationFrame(redraw);
});

