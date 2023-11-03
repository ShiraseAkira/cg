function initCanvas() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.lineJoin = "round";
    context.lineCap = "round";
    return [canvas, context];
}

//update element context according to drawing inputs
function updateContext(context) {
    const colorPicker = document.getElementById("color");
    const widthPicker = document.getElementById("drawWidth");
    context.strokeStyle = colorPicker.value;
    context.lineWidth = widthPicker.value;
}

function initDrawing(canvas, context) {
    updateContext(context);

    let isDrawing = false;    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
        context.lineTo(e.offsetX + 1, e.offsetY + 1);
        context.stroke();
    });
    canvas.addEventListener('mouseup', (e) => {
        if(isDrawing) {
            isDrawing = false;
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
            context.closePath();
        }
    });
    window.addEventListener('mouseup', () => {
            isDrawing = false;
    });

    canvas.addEventListener('mouseout', (e) => {
        if(isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
            context.closePath();
        }
    });
    canvas.addEventListener('mouseover', (e) => {
        if(isDrawing) {
            context.beginPath();
            context.moveTo(e.offsetX, e.offsetY);
        }
    });
    canvas.addEventListener('mousemove', (e) => {
        if(isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        }
    });
}

function initDrawingControls(context) {
    const colorPicker = document.getElementById("color");
    const widthPicker = document.getElementById("drawWidth");

    colorPicker.addEventListener("change", (e) => context.strokeStyle = e.target.value);
    widthPicker.addEventListener("change", (e) => context.lineWidth = e.target.value);
}

function initCreateDialog(canvas, context) {
    const newButton = document.getElementById("new");
    const newDialog = document.getElementById("newModal");
    const newCreate = document.getElementById("newCreate");
    const newCancel = document.getElementById("newCancel");

    const inputs = newDialog.getElementsByClassName("dialog-input");

    newButton.addEventListener("click", () => newDialog.classList.toggle("hidden"));
    newCancel.addEventListener("click", () => newDialog.classList.toggle("hidden"));
    newCreate.addEventListener("click", () => {
        canvas.width = inputs[0].value;
        canvas.height = inputs[1].value;
        
        updateContext(context);
        context.clearRect(0, 0, canvas.width, canvas.height);
        newDialog.classList.toggle("hidden");
    });
}

function initOpenDialog(canvas, context) {
    function drawImage() {
        canvas.width = img.width;
        canvas.height = img.height;
        updateContext(context);
        context.drawImage(img, 0, 0);
    }

    const img = new Image;
    const inputFile = document.getElementById("file");
    inputFile.addEventListener("change",  (e) => {
        img.addEventListener("load", drawImage);
        img.src = URL.createObjectURL(e.target.files[0]);
    });

    const openButton = document.getElementById("open");
    openButton.addEventListener("click", () => inputFile.click());
}

function initSaveDialog(canvas) {
    const saveButton = document.getElementById("save");
    const saveDialog = document.getElementById("saveModal");
    const saveCreate = document.getElementById("saveCreate");
    const saveCancel = document.getElementById("saveCancel");

    const fileNameImput = document.getElementById("fileName");
    const fileTypeInput = document.getElementById("type");

    const link = document.createElement("a");

    saveButton.addEventListener("click", () => saveDialog.classList.toggle("hidden"));
    saveCancel.addEventListener("click", () => saveDialog.classList.toggle("hidden"));
    saveCreate.addEventListener("click", () => {
        link.download = fileNameImput.value + fileTypeInput.options[fileTypeInput.selectedIndex].text;
        link.href = canvas.toDataURL(fileTypeInput.value);
        link.click();
        saveDialog.classList.toggle("hidden");
    });
}

window.addEventListener("load", () => {
    const [canvas, context] = initCanvas();
    initDrawing(canvas, context);
    initDrawingControls(context);
    initCreateDialog(canvas, context);
    initOpenDialog(canvas, context);
    initSaveDialog(canvas);
});
