let canvas, context;
let translateX, translateY;
let isDragging = false;
let posX, posY;
let xc, yc, r;
let borderColor, fillColor;
let xmin, xmax, ymin, ymax;


function pixelIsOnScreenAfterTranslation(x, y) {
    let xbounds = (translateX >= 0) ?
                    (x >= xmin) && (x <= xmax - translateX) :
                    (x >= xmin - translateX) && (x <= xmax);

    let ybounds = (translateY >= 0) ?
                    (y >= ymin) && (y <= ymax - translateY) :
                    (y >= ymin - translateY) && (y <= ymax);
    
    return xbounds && ybounds;
}

function drawPixelIfOnScreen(x, y) {
    if (pixelIsOnScreenAfterTranslation(x, y))  {
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

function fillLine(xc, yc, x, y) {
    for(let i = 1; i <= y; i++) {
        if (pixelIsOnScreenAfterTranslation(xc + x, yc + y - i)) {
            drawPixelIfOnScreen(xc + x, yc + y - i);
        }   
        if (pixelIsOnScreenAfterTranslation(xc - x, yc + y - i)) {
            drawPixelIfOnScreen(xc - x, yc + y - i);
        } 
        if (pixelIsOnScreenAfterTranslation(xc + x, yc - y + i)) {
            drawPixelIfOnScreen(xc + x, yc - y + i);
        }
        if (pixelIsOnScreenAfterTranslation(xc - x, yc - y + i)) {
            drawPixelIfOnScreen(xc - x, yc - y + i);
        }
        if (pixelIsOnScreenAfterTranslation(xc + y - i, yc + x)) {
            drawPixelIfOnScreen(xc + y - i, yc + x);
        }
        if (pixelIsOnScreenAfterTranslation(xc - y + i, yc + x)) {
            drawPixelIfOnScreen(xc - y + i, yc + x);
        }
        if (pixelIsOnScreenAfterTranslation(xc + y - i, yc - x)) {
            drawPixelIfOnScreen(xc + y - i, yc - x);
        }
        if (pixelIsOnScreenAfterTranslation(xc - y + i, yc - x)) {
            drawPixelIfOnScreen(xc - y + i, yc - x);
        } 
    }
}

function fill() {
    let x = 0, y = r, d = 3 - 2 * r;

    fillLine(xc, yc, x, y)
    while (y >= x) {
        x++;           
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        fillLine(xc, yc, x, y)
    }        
}


function fillCircle() {
    context.fillStyle = fillColor;
    translateX = context.getTransform().e;
    translateY = context.getTransform().f;
    
    fill(); 
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
        }
    });

    window.requestAnimationFrame(redraw);
});

