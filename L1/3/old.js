function createPixel(color) {
    const pixel = context.createImageData(1, 1);
    const rComponent = parseInt(color.slice(1,3), 16);
    const gComponent = parseInt(color.slice(3,5), 16);
    const bComponent = parseInt(color.slice(5,7), 16);
    pixel.data[0] = rComponent;
    pixel.data[1] = gComponent;
    pixel.data[2] = bComponent;
    pixel.data[3] = 255;

    return pixel;
}

function putPixels(xc, yc, x, y, pixelData) {
    context.putImageData(pixelData, xc + x, yc + y);    
    context.putImageData(pixelData, xc - x, yc + y);    
    context.putImageData(pixelData, xc + x, yc - y);    
    context.putImageData(pixelData, xc - x, yc - y);    
    context.putImageData(pixelData, xc + y, yc + x);    
    context.putImageData(pixelData, xc - y, yc + x);    
    context.putImageData(pixelData, xc + y, yc - x);    
    context.putImageData(pixelData, xc - y, yc - x);      
}

    const pixelData = createPixel(borderColor);
    putPixels(xc, yc, x, y, pixelData);