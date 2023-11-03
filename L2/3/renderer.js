export async function initRenderer(canvas) {
    const ctx = canvas.getContext('2d');

    const imageSrcs = [
        "./images/sky.jpg",
        "./images/earth.png",
        "./images/moon.png",
        "./images/explosion.jpg"
    ];
    async function loadImages() {
        const promiseArray = [];
        const imageArray = [];

        for(let src of imageSrcs) {
            promiseArray.push(new Promise(resolve => {
                const img = new Image();
                img.addEventListener('load', resolve);
                img.src = src;
                imageArray.push(img);
            }));        
        }

        await Promise.all(promiseArray);

        return imageArray;
    }

    let [sky, earth, moon, expl] = await loadImages();

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

        if (!data.isSimulating) {            
            drawArrow(data.moon.x, data.moon.y, data.moon.x + data.moon.vx, data.moon.y + data.moon.vy);
        }
    }

    return { render };
};