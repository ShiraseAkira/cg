export async function initPhysics() {
    let f32a = new Float32Array(0);
    const acceleration = 0.25;

    function getData() {
        return f32a;
    }
    const resizeArray = (arr, len) => {
        if (arr.length === len) return arr;
        const resizedArrayBuffer = new ArrayBuffer(len),
        resizedView = new Float32Array(resizedArrayBuffer)
    
        for (let i = 0; i < arr.length; i++) {
            resizedView[i] = arr[i];
        }
    
        return resizedView;
    }

    function tick(count) {
        f32a = resizeArray(f32a, count * 16);

        for (let ptr = 0; ptr < f32a.length; ptr +=4) {
            f32a[ptr + 0] += f32a[ptr + 2];
            f32a[ptr + 1] += f32a[ptr + 3];
            f32a[ptr + 3] += acceleration;
        }
    }

    function fire(x, y) {
        for (let ptr = 0; ptr < f32a.length; ptr +=4) {
            f32a[ptr + 0] = x;
            f32a[ptr + 1] = y;
            const amplitude = Math.sqrt(Math.random()) * 20;
            const angle = Math.random() * Math.PI * 2;
            f32a[ptr + 2] = Math.cos(angle) * amplitude;
            f32a[ptr + 3] = Math.sin(angle) * amplitude;
        }
    }

    return { getData , tick, fire };
};