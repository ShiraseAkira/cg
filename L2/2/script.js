window.addEventListener("load", () => {    
    const [canvas, context] = initCanvas();
    initDrawingParamsControls();
    setMouseEventListenersForDrawing();
    initDialogNewControls();
    initDialogOpenControls();
    initDialogSaveControls();

    function initCanvas() {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.lineJoin = "round";
        context.lineCap = "round";
        return [canvas, context];
    }

    function getDrawingParameters() {
        return [
            document.getElementById("color").value,
            document.getElementById("drawWidth").value
        ];
    }

    function setDrawingParameters() {
        [context.strokeStyle, context.lineWidth] = getDrawingParameters();
    }

    function initDrawingParamsControls() {
        const colorControl = document.getElementById("color");
        const widthControl = document.getElementById("drawWidth");
        colorControl.addEventListener("change", setDrawingParameters);
        widthControl.addEventListener("change", setDrawingParameters);

        setDrawingParameters();
    }

    function setMouseEventListenersForDrawing() {
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

    function initDialogNewControls() {
        const newButton = document.getElementById("new");
        const newDialog = document.getElementById("newModal");
        const newCreateButton = document.getElementById("newCreate");
        const newCancelButton = document.getElementById("newCancel");

        const inputs = newDialog.getElementsByClassName("dialog-input");

        newButton.addEventListener("click", () => newDialog.classList.toggle("hidden"));
        newCancelButton.addEventListener("click", () => newDialog.classList.toggle("hidden"));
        newCreateButton.addEventListener("click", () => {
            canvas.width = inputs[0].value;
            canvas.height = inputs[1].value;
            
            setDrawingParameters(context);
            context.clearRect(0, 0, canvas.width, canvas.height);
            newDialog.classList.toggle("hidden");
        });
    }

    function initDialogOpenControls() {
        function drawImage() {
            canvas.width = img.width;
            canvas.height = img.height;
            setDrawingParameters(context);
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

    function initDialogSaveControls() {
        const saveButton = document.getElementById("save");
        const saveDialog = document.getElementById("saveModal");
        const saveSaveButton = document.getElementById("saveCreate");
        const saveCancelButton = document.getElementById("saveCancel");

        const fileNameImput = document.getElementById("fileName");
        const fileTypeInput = document.getElementById("type");

        const link = document.createElement("a");

        saveButton.addEventListener("click", () => saveDialog.classList.toggle("hidden"));
        saveCancelButton.addEventListener("click", () => saveDialog.classList.toggle("hidden"));
        saveSaveButton.addEventListener("click", () => {
            link.download = fileNameImput.value + fileTypeInput.options[fileTypeInput.selectedIndex].text;
            link.href = canvas.toDataURL(fileTypeInput.value);
            link.click();
            saveDialog.classList.toggle("hidden");
        });
    }
});
