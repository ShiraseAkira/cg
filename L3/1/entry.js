import { initCurve } from './curve.js';
import { initRenderer } from './renderer.js';

class ControlPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.boxSize = 10;
    }

    getBoundingBox() {
        return [this.x - this.boxSize, this.x + this.boxSize,
                this.y - this.boxSize, this.y + this.boxSize,]
    }

    isInBoundingBox(x, y) {
        const box = this.getBoundingBox();
        if (x < box[0] ||
            x > box[1] ||
            y < box[2] ||
            y > box[3]) 
                {
                    return false;
                }
        return true;
    }
}

async function main() {
    const canvas = document.getElementById("canvas");

    const controlPoints = [
        new ControlPoint(-50, -50),
        new ControlPoint(-50, 50),
        new ControlPoint(50, 50),
        new ControlPoint(50, -50)];

    let canvasWidth;
    let canvasHeight;

    
    const { getData, updateCurve } = await initCurve(controlPoints);
    const { render } = await initRenderer(canvas);

    {
        const resizeHandler = () => {
            canvasWidth = canvas.clientWidth;
            canvasHeight = canvas.clientHeight;
        }
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
    }

    {
        let isDragging = false;
        let posX, posY, controlPoint;

        const mouseDownHandler = (e) => {
            posX = e.offsetX - canvas.clientWidth / 2;
            posY = e.offsetY - canvas.clientHeight / 2;

            for (let i = 0; i < controlPoints.length; i++) {
                if (controlPoints[i].isInBoundingBox(posX, posY)) {
                    controlPoint = controlPoints[i];
                    isDragging = true;
                    break;
                }
            }

        }
        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas.addEventListener('mouseup', () => isDragging = false);

        const mouseMoveHandler = (e) => {
            if(isDragging) {
                let deltaX = e.offsetX - posX - canvas.clientWidth / 2;
                let deltaY = e.offsetY - posY - canvas.clientHeight / 2;

                controlPoint.x += deltaX;
                controlPoint.y += deltaY;

                posX += deltaX;
                posY += deltaY;

                updateCurve(controlPoints);
            }
        }
        canvas.addEventListener('mousemove', mouseMoveHandler);
    }

    {
        const frame = () => {
            requestAnimationFrame(frame);
            render(getData(), canvasWidth, canvasHeight);
        }
        frame();
    }
};

main();