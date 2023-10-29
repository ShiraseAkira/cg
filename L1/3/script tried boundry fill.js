let canvas, context, imageData;
let translateX, translateY;
let isDragging = false;
let posX, posY;
let xc, yc, r;
let borderColor, fillColor;
let xmin, xmax, ymin, ymax;

function pixelIsOnScreen(x, y) {
    return (x >= xmin) && (x <= xmax) && (y >= ymin) && (y <= ymax);
}

function pixelIsOnScreenAfterTranslation(x, y) {
    translateX = context.getTransform().e;
    translateY = context.getTransform().f;
    
    let xbounds = (translateX >= 0) ?
                    (x >= xmin) && (x <= xmax - translateX) :
                    (x >= xmin - translateX) && (x <= xmax);

    let ybounds = (translateY >= 0) ?
                    (y >= ymin) && (y <= ymax - translateY) :
                    (y >= ymin - translateY) && (y <= ymax);
    
    return xbounds && ybounds;
}

function drawPixelIfOnScreen(x, y) {
    if (pixelIsOnScreen(x, y))  {
        context.fillRect(x, y, 1, 1);
    }
}

function drawCirclePixels(xc, yc, x, y) {
    drawPixelIfOnScreen(xc + x, yc + y);    
    drawPixelIfOnScreen(xc - x, yc + y);    
    drawPixelIfOnScreen(xc + x, yc - y);    
    drawPixelIfOnScreen(xc - x, yc - y);    
    drawPixelIfOnScreen(xc + y, yc + x);    
    drawPixelIfOnScreen(xc - y, yc + x);    
    drawPixelIfOnScreen(xc + y, yc - x);    
    drawPixelIfOnScreen(xc - y, yc - x);      
}

function drawCircle() {
    context.fillStyle = borderColor;

    let x = 0, y = r, d = 3 - 2 * r;
    drawCirclePixels(xc, yc, x, y)
    while (y >= x) {
        x++;           
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        drawCirclePixels(xc, yc, x, y)
    }
}

function getValidFillStartPoint(xc, yc, x, y) {
    if (pixelIsOnScreenAfterTranslation(xc + x, yc + y - 1)) {
        return [xc + x, yc + y - 1]
    }   
    if (pixelIsOnScreenAfterTranslation(xc - x, yc + y - 1)) {
        return [xc - x, yc + y - 1]
    }
    if (pixelIsOnScreenAfterTranslation(xc + x, yc - y + 1)) {
        return [xc + x, yc - y + 1]
    }
    if (pixelIsOnScreenAfterTranslation(xc - x, yc - y + 1)) {
        return [xc - x, yc - y + 1]
    }
    if (pixelIsOnScreenAfterTranslation(xc + y - 1, yc + x)) {
        return [xc + y - 1, yc + x]
    }
    if (pixelIsOnScreenAfterTranslation(xc - y + 1, yc + x)) {
        return [xc - y + 1, yc + x]
    }
    if (pixelIsOnScreenAfterTranslation(xc + y - 1, yc - x)) {
        return [xc + y - 1, yc - x]
    }
    if (pixelIsOnScreenAfterTranslation(xc - y + 1, yc - x)) {
        return [xc - y + 1, yc - x]
    } 
}

function findFillingStartPoint() {
    let x = 0, y = r, d = 3 - 2 * r;

    let startPoint;

    startPoint = getValidFillStartPoint(xc, yc, x, y)
    if (!startPoint) {
        while (y >= x) {
            x++;           
            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }
            startPoint = getValidFillStartPoint(xc, yc, x, y)
            if (startPoint) {
                break;
            }
        }        
    }
    return startPoint ? startPoint : [0, 0];
}

function getPixelColor(x, y) {
    translateX = context.getTransform().e;
    translateY = context.getTransform().f;
    const startIndex = (y) * (canvas.width * 4) + (x) * 4;    
    return `rgba(${imageData[startIndex]}, ${imageData[startIndex + 1]}, ${imageData[startIndex + 2]}, ${imageData[startIndex + 3] / 255})`;
}

function hexToRGBA(color) {
    const rComponent = parseInt(color.slice(1,3), 16);
    const gComponent = parseInt(color.slice(3,5), 16);
    const bComponent = parseInt(color.slice(5,7), 16);
    return `rgba(${rComponent}, ${gComponent}, ${bComponent}, 1)`;
}

function updateImageData(x, y) {
    // translateX = context.getTransform().e;
    // translateY = context.getTransform().f;
    const startIndex = (y) * (canvas.width * 4) + (x) * 4;  
    const rComponent = parseInt(fillColor.slice(1,3), 16);
    const gComponent = parseInt(fillColor.slice(3,5), 16);
    const bComponent = parseInt(fillColor.slice(5,7), 16);
    imageData[startIndex + 0] = rComponent;
    imageData[startIndex + 1] = gComponent;
    imageData[startIndex + 2] = bComponent;
    imageData[startIndex + 3] = 255;
}

function boundaryFill(x, y) {
    const pixelsToFill = [[x, y]];

    while (pixelsToFill.length > 0) {
        nextPixel = pixelsToFill.pop();
        const x = nextPixel[0];
        const y = nextPixel[1]
        if (pixelIsOnScreenAfterTranslation(x, y) &&
            getPixelColor(x, y) != hexToRGBA(borderColor) &&
            getPixelColor(x, y) != hexToRGBA(fillColor)) {
            drawPixelIfOnScreen(x, y);
            updateImageData(x, y);
            pixelsToFill.push([x + 1, y]);
            pixelsToFill.push([x, y + 1]);
            pixelsToFill.push([x - 1, y]);
            pixelsToFill.push([x, y - 1]);
        }
    }
}

function fillCircle() {
    context.fillStyle = fillColor;
    translateX = context.getTransform().e;
    translateY = context.getTransform().f;
    imageData = context.getImageData(translateX, translateY, canvas.width, canvas.height).data;

    // console.log(imageData);
    
    const fillStart = findFillingStartPoint();
    boundaryFill(fillStart[0], fillStart[1]);   
}

function redraw() {
    window.requestAnimationFrame(redraw);
    context.save();
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    drawCircle();
    fillCircle();
}

window.addEventListener("load", () => {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d", {willReadFrequently: true});

    xmin = 0;
    xmax = canvas.width - 1;
    ymin = 0;
    ymax = canvas.height - 1;

    const xField = document.getElementById("x");
    xc = parseInt(xField.value);
    const yField = document.getElementById("y");
    yc = parseInt(yField.value);
    const rField = document.getElementById("r");
    r = parseInt(rField.value);
    const borderColorField = document.getElementById("bdcl");
    borderColor = borderColorField.value;
    const fillColorField = document.getElementById("fillcl");
    fillColor = fillColorField.value;

    xField.addEventListener("change", (e) => {
        xc = parseInt(e.target.value);
        window.requestAnimationFrame(redraw);
    });
    yField.addEventListener("change", (e) => {
        yc = parseInt(e.target.value);
        window.requestAnimationFrame(redraw);
    });
    rField.addEventListener("change", (e) => {
        r = parseInt(e.target.value);
        window.requestAnimationFrame(redraw);
    });
    borderColorField.addEventListener("change", (e) => {
        borderColor = e.target.value;
        window.requestAnimationFrame(redraw);
    });
    fillColorField.addEventListener("change", (e) => {
        fillColor = e.target.value;
        window.requestAnimationFrame(redraw);
    });

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

            // window.requestAnimationFrame(redraw);
        }
    });

    window.requestAnimationFrame(redraw);
});

