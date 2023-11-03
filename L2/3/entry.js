import { initPhysics } from './physics.js';
import { initRenderer } from './renderer.js';

class CelestialBody {
    constructor(x, y, vx, vy, mass, r) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.size = r;
    }

    getBoundingBox() {
        return [this.x - this.size / 2, this.x + this.size / 2,
                this.y - this.size / 2, this.y + this.size / 2];
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

    let canvasWidth;
    let canvasHeight;

    const bodies = [new CelestialBody(0, 0, 0, 0, 10, 100),
                    new CelestialBody(-100, -100, 50, 0, 1, 50)];

    const { getData, tick, toggleSimulation, speedUp, speedDown, turnSpeedVectorCCW, turnSpeedVectorCW } = await initPhysics(...bodies);
    const { render } = await initRenderer(canvas);

    {
        const resizeHandler = () => {
            canvasWidth = canvas.clientWidth;
            canvasHeight = canvas.clientHeight;
        }
        window.addEventListener('resize', resizeHandler);
        resizeHandler();

        const keyDownHandler = (e) => {
            switch(e.code) {
                case "Space": toggleSimulation(); break;
                case "ArrowLeft": turnSpeedVectorCCW(bodies[1]); break;
                case "ArrowRight":turnSpeedVectorCW(bodies[1]); break;
                case "ArrowUp": speedUp(bodies[1]); break;
                case "ArrowDown": speedDown(bodies[1]); break;
            }
        }
        window.addEventListener("keydown", keyDownHandler);
    }

    {
        let isDragging = false;
        let posX, posY, body;

        const mouseDownHandler = (e) => {
            posX = e.offsetX - canvas.clientWidth / 2;
            posY = e.offsetY - canvas.clientHeight / 2;

            for (let i = 0; i < bodies.length; i++) {
                if (bodies[i].isInBoundingBox(posX, posY)) {
                    body = bodies[i];
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
                body.x += deltaX;
                body.y += deltaY;
                posX += deltaX;
                posY += deltaY;
            }
        }
        canvas.addEventListener('mousemove', mouseMoveHandler);
    }

    {
        const frame = () => {
            requestAnimationFrame(frame);

            tick();
            render(getData(), canvasWidth, canvasHeight);
        }
        frame();
    }
};

main();