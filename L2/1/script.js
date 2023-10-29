window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const img = new Image;
    let isDragging = false;
    let posX, posY;

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

    const fileInput = document.getElementById("imageFile");
    fileInput.addEventListener("change", (e) => {
        img.addEventListener("load", drawImage);
        img.src = URL.createObjectURL(e.target.files[0]);

        window.requestAnimationFrame(redraw);
    });

    function drawImage() {
        context.drawImage(img, 0, 0);
    }

    function redraw() {   
        context.save();
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        
        drawImage();
        window.requestAnimationFrame(redraw);
    }
});
