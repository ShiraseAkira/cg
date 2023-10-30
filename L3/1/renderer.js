export async function initRenderer(canvas) {
    const gl = canvas.getContext('webgl');
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.clearColor(0, 0, 0, 1);

    const program = gl.createProgram();

    {
        const shader = gl.createShader(gl.VERTEX_SHADER);
        const source = await (await fetch('vert.glsl')).text();
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.attachShader(program, shader);
    }

    {
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        const source = await (await fetch('frag.glsl')).text();
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.attachShader(program, shader);
    }

    gl.linkProgram(program);
    gl.useProgram(program);

    {
        const attribLocation = gl.getAttribLocation(program, 'a_coord');
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(
            attribLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
    }

    {
        const sizeLoc = gl.getUniformLocation(program, 'u_size');
        gl.uniform1f(sizeLoc, 10.0);
    }

    function render (points, width, height) {        
        if (width !== canvas.width || height !== canvas.height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);

            const attribLocation = gl.getAttribLocation(program, 'a_scale');
            gl.disableVertexAttribArray(attribLocation);
            gl.vertexAttrib2f (
                attribLocation,
                2 / canvas.width,
                - 2 / canvas.height
            );
        }        

        
        gl.clear(gl.COLOR_BUFFER_BIT);

        const color = gl.getUniformLocation(program, 'u_color');
        gl.uniform4f(color, 0.2, 0.2, 0.2, 1);

        const controlPoints = points[0];
        let vertexCount = controlPoints.length / 2;        

        gl.bufferData(
            gl.ARRAY_BUFFER,
            controlPoints,
            gl.DYNAMIC_DRAW
        );

        gl.drawArrays(gl.LINES, 0, vertexCount);

        gl.uniform4f(color, 1.0, 1.0, 1.0, 1.0);
        gl.drawArrays(gl.POINTS, 0, vertexCount);

        const linePoints = points[1];
        vertexCount = linePoints.length / 2;  

        gl.bufferData(
            gl.ARRAY_BUFFER,
            linePoints,
            gl.DYNAMIC_DRAW
        );

        gl.drawArrays(gl.LINE_STRIP, 0, vertexCount);
    }

    return { render };
};