const CL_SKIN = "#fadab2";
const CL_HAT_PRIMARY = "#57c523";
const CL_HAT_SECONDARY = "#229b36";
const CL_BLACK = "#000000";
const CL_PUPIL = "#FCFCFC";
const CL_PANTS = "#3E655F";
const CL_FEET = "#322C35";
const CL_TORSO = "#FE6415";

let canvas, context;
let isDragging = false;
let posX, posY;

function drawBackHat() {
    context.beginPath()
    context.roundRect(80 + (300 - 580/2), 0, 580, 240, [50, 50, 0, 0]);
    context.fillStyle = CL_HAT_PRIMARY;
    context.fill();
}

function drawHatEars() {
    context.fillStyle = CL_HAT_PRIMARY;
    context.strokeStyle = CL_BLACK;
    context.lineWidth = 2;

    //left ear
    context.beginPath();
    context.ellipse(80, 350, 145, 55, Math.PI * -67/180, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.ellipse(80, 350, 145, 55, Math.PI * -67/180, 0, Math.PI * (3.55/2), true);
    context.stroke();

    //right ear
    context.save();
    context.scale(-1,1);
    context.beginPath();
    context.ellipse(-680, 350, 145, 55, Math.PI * -67/180, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.ellipse(-680, 350, 145, 55, Math.PI * -67/180, 0, Math.PI * (3.55/2), true);
    context.stroke();
    context.restore();
}

function drawFrontHat() {
    drawHatEars();

    context.beginPath();
    context.moveTo(80 + (300 - 510/2), 110);
    context.lineTo(80 + (300 + 510/2), 110);
    context.lineTo(80 + (300 + 510/2), 275);
    context.quadraticCurveTo(80 + 300, 230, 80 + (300 - 510/2), 275)
    context.fillStyle = CL_HAT_SECONDARY;
    context.fill();
}

function drawEyes() {
    //left eye
    context.beginPath();
    context.fillStyle = CL_PUPIL;
    context.ellipse(300, 355, 100, 85, Math.PI * -55/180, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.fillStyle = CL_BLACK;
    context.arc(325, 355, 10, 0, 2 * Math.PI);    context.fill();

    //right eye
    context.save();
    context.scale(-1,1);
    context.beginPath();
    context.fillStyle = CL_PUPIL;
    context.ellipse(-475, 355, 100, 85, Math.PI * -55/180, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.fillStyle = CL_BLACK;
    context.arc(-450, 355, 10, 0, 2 * Math.PI);
    context.fill();

    //eye separation line
    context.beginPath();
    context.ellipse(-475, 355, 100, 85, Math.PI * -55/180, Math.PI * (35/180), Math.PI * (65/180));
    context.strokeStyle = CL_BLACK;
    context.lineWidth = 2;
    context.stroke();
    context.restore();    
}

function drawMouth() {
    context.beginPath();
    context.ellipse(380, 830, 200, 300, 0, Math.PI * (-100/180), Math.PI * (-75/180));
    context.strokeStyle = CL_BLACK;
    context.lineWidth = 3;
    context.stroke();
}

function drawFace() {
    context.beginPath();
    context.arc(80 + 300, 20 + 300, 300, 0, Math.PI * 2);
    context.fillStyle = CL_SKIN;
    context.fill();

    drawEyes();
    drawMouth()
}

function drawHead() {
    drawFace()
    drawBackHat();
    drawFrontHat();
}

function drawLowerBody() {
    //legs
    context.fillStyle = CL_PANTS;
    context.fillRect(80 + (300 - 400/2), 820, 400, 75);

    //feet
    context.fillStyle = CL_FEET;
    context.strokeStyle = CL_FEET;

    context.save();
    context.lineJoin = "round";
    context.lineWidth = 10;

    context.beginPath();   
    context.moveTo(80 + (300 - 400/2) - 30, 895);
    context.lineTo(80 + (300 + 400/2) + 30, 895);
    context.lineTo(80 + 300 , 875);
    context.closePath();
    context.fill();
    context.stroke();

    context.restore();
}

function drawHands() {
    context.fillStyle = CL_HAT_PRIMARY;
    context.strokeStyle = CL_BLACK;
    context.lineWidth = 3;

    //left hand
    //left sleeve
    context.beginPath();
    context.ellipse(80 + 300, 800, 205, 300, 0, Math.PI * (191/180), Math.PI * (208/180));
    context.stroke();
    //left palm
    context.beginPath();
    context.arc(80 + 55, 20 + 750, 48, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(120 + 55, 20 + 750 - 20, 21, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
    context.fill();

    //right hand
    context.save();
    context.scale(-1,1);
    //right sleeve
    context.beginPath();
    context.ellipse(80 + 300 - 760, 800, 205, 300, 0, Math.PI * (195/180), Math.PI * (209/180));
    //349 332
    context.stroke();
    //right palm
    context.beginPath();
    context.arc(80 + 55 - 760, 20 + 750, 48, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(120 + 55 - 760, 20 + 750 - 20, 21, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
    context.fill();

    context.restore()
}

function drawPocketsZipper() {
    //zipper
    context.beginPath();
    context.moveTo(80 + 300, 450);
    context.lineTo(80 + 300, 845)
    context.closePath();
    context.stroke();

    context.lineJoin = "bevel";

    //left pocket
    context.beginPath();
    context.moveTo(0 + 250, 0 + 660);
    context.lineTo(41 + 250, 45 + 660);
    context.lineTo(82 + 250, 0 + 660);
    context.closePath();
    context.stroke();

    context.strokeRect(0 + 250, 0 + 660, 82, 94);

    //right pocket
    context.save();
    context.scale(-1,1);

    context.beginPath();
    context.moveTo(0 + 250 - 760, 0 + 660);
    context.lineTo(41 + 250 - 760, 45 + 660);
    context.lineTo(82 + 250 - 760, 0 + 660);
    context.closePath();
    context.stroke();

    context.strokeRect(0 + 250 - 760, 0 + 660, 82, 94);

    context.restore()
}

function drawJacket() {
    context.fillStyle = CL_TORSO;
    context.beginPath();   
    context.ellipse(80 + 300, 800, 280, 380, 0, Math.PI, 0);
    context.closePath();
    context.fill();
    context.beginPath(); 
    context.ellipse(80 + 300, 644, 440, 200, 0, Math.PI * (51/180), Math.PI * (129/180));
    context.closePath();
    context.fill();
}

function drawScarf() {
    context.fillStyle = CL_HAT_SECONDARY;
    context.beginPath();
    context.ellipse(280, 588, 115, 20, Math.PI * (23/180), 0, Math.PI * 2);
    context.closePath();
    context.fill();

    context.save();
    context.scale(-1,1);

    context.beginPath();
    context.ellipse(274 - 760, 583, 115, 30, Math.PI * (25/180), 0, Math.PI * 2);
    context.closePath();
    context.fill();

    context.restore()
}

function drawTorso() {
    drawJacket();
    drawHands();
    drawPocketsZipper();
    drawScarf();
}

function drawCharacter() {
    drawLowerBody();
    drawTorso();
    drawHead();
}

function redraw() {
    context.save();
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    
    drawCharacter();
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

            redraw();
        }
    });

    window.requestAnimationFrame(redraw);
});

