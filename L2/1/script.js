'use strict';

function getImageBoundingBox(img) {
    return [img.xCoord, img.xCoord + img.width, img.yCoord, img.yCoord + img.height];
}

function isCoordsInImageBoundingBox(img, x, y) {
    const box = getImageBoundingBox(img);
    if (x < box[0] ||
        x > box[1] ||
        y < box[2] ||
        y > box[3]) 
            {
                return false;
            }
    return true;
}

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.font = "20px sans-serif";
    context.textBaseline = "top";
    let images = [];
    let isDragging = false;
    let draggingImage;
    let posX, posY;

    canvas.addEventListener('mousedown', (e) => {
        for(let i = 0; i < images.length; i++) {
            if (isCoordsInImageBoundingBox(images[i], e.offsetX, e.offsetY)) {
                draggingImage = images[i];
                isDragging = true;
                posX = e.offsetX;
                posY = e.offsetY;  
                break;
            }
        }        
    });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseout', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
        if(isDragging) {
            let deltaX = e.offsetX - posX;
            let deltaY = e.offsetY - posY;
            draggingImage.xCoord += deltaX;
            draggingImage.yCoord += deltaY; 
            posX += deltaX;
            posY += deltaY;
            draw();
        }
    });

    const fileInput = document.getElementById("imageFile");
    fileInput.addEventListener("change", (e) => {
        images = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < e.target.files.length; i++) {
            const img = new Image;
            img.xCoord = 0;
            img.yCoord = 0;
            img.fileName = e.target.files[i].name;
            img.addEventListener("load", () => context.drawImage(img, img.xCoord, img.yCoord));
            img.src = URL.createObjectURL(e.target.files[i]);
            images.push(img);
        }
    });

    function drawImages() {
        for(let i = 0; i < images.length; i++) {
            context.drawImage(images[i], images[i].xCoord, images[i].yCoord);
        }  
    }

    function drawCoords() {
        const lineHeight = 24;
        for(let i = 0; i < images.length; i++) {
            const message = `Файл "${images[i].fileName}"; координаты x: ${images[i].xCoord}, y: ${images[i].xCoord}`;
            context.fillText(message, 0, lineHeight * i);
        }  
    }

    function draw() {   
        context.clearRect(0, 0, canvas.width, canvas.height);        
        drawImages();
        drawCoords();
    }

    draw();
});

        //todo less idle animations; ++
        //todo image coords; ++
        //todo multiple images movable separately (optional); ++