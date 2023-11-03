export async function initRenderer(canvas) {
    const ctx = canvas.getContext('2d');
    const sky = new Image();
    sky.src = "./images/sky.jpg";
    const earth = new Image();
    earth.src = "./images/earth.png";
    const moon = new Image();
    moon.src = "./images/moon.png";
    const expl = new Image();
    expl.src = "./images/explosion.jpg";

    function drawArrow(fromx, fromy, tox, toy) {
        const headlen = 10;
        const dx = tox - fromx;
        const dy = toy - fromy;
        const angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.stroke();
    }

    function render (data, width, height) {
        if (width !== canvas.width || height !== canvas.height) {
            canvas.width = width;
            canvas.height = height;
            ctx.translate(width / 2, height / 2);
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 3;
            ctx.lineCap = 'round'
        }

        if (data.hasExploded) {
            ctx.drawImage(expl, -width / 2, -height / 2);
            return;
        }

        ctx.clearRect (-width / 2, -height / 2, width, height);

        ctx.drawImage(sky, -width / 2, -height / 2);
        ctx.drawImage(earth, data.earth.x - data.earth.size / 2, data.earth.y - data.earth.size / 2, data.earth.size, data.earth.size);
        ctx.drawImage(moon, data.moon.x - data.moon.size / 2, data.moon.y - data.moon.size / 2, data.moon.size, data.moon.size);

        if (!data.state) {            
            drawArrow(data.moon.x, data.moon.y, data.moon.x + data.moon.vx, data.moon.y + data.moon.vy);
        }
    }

    return { render };
};