export async function initRenderer(canvas) {
    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);

    const dashedTexture = [
        255, 255, 255, 255,
        255, 255, 255, 255,
        255, 255, 255, 255,
        255, 255, 255, 255,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ];

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

    const programDashed  = gl.createProgram();
    {
        const shader = gl.createShader(gl.VERTEX_SHADER);
        const source = await (await fetch('vert2.glsl')).text();
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.attachShader(programDashed, shader);
    }
    {
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        const source = await (await fetch('frag2.glsl')).text();
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.attachShader(programDashed, shader);
    }
    gl.linkProgram(programDashed);

    
    function render (points, width, height) {        
        if (width !== canvas.width || height !== canvas.height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);

            let attribLocation = gl.getAttribLocation(program, 'a_scale');
            gl.disableVertexAttribArray(attribLocation);
            gl.vertexAttrib2f (
                attribLocation,
                2 / canvas.width,
                - 2 / canvas.height
            );
        }
        
        const controlPoints = points[0];
        const controlPointsCount = controlPoints.length / 2;
        const curvePoints = points[1];
        const curvePointsCount = curvePoints.length / 2;  

        
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        {
            const sizeLoc = gl.getUniformLocation(program, 'u_size');
            gl.uniform1f(sizeLoc, 10.0);
            const color = gl.getUniformLocation(program, 'u_color');
            gl.uniform4f(color, 1, 1, 1, 1);
        }

        
        {
            let coordinatesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, coordinatesBuffer);
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
            
        gl.bufferData(
            gl.ARRAY_BUFFER,
            controlPoints,
            gl.DYNAMIC_DRAW
        );
        gl.drawArrays(gl.POINTS, 0, controlPointsCount);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            curvePoints,
            gl.DYNAMIC_DRAW
        );        

        gl.drawArrays(gl.LINE_STRIP, 0, curvePointsCount);



        gl.useProgram(programDashed);
        {
            let coordinatesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, coordinatesBuffer);
            let attribLocation = gl.getAttribLocation(programDashed, 'a_coord');
            gl.enableVertexAttribArray(attribLocation);
            gl.vertexAttribPointer(
                attribLocation,
                2,
                gl.FLOAT,
                false,
                0,
                0
            );
            gl.bufferData(
                gl.ARRAY_BUFFER,
                controlPoints,
                gl.DYNAMIC_DRAW
            );

            let lengthSoFarBuffer = gl.createBuffer();    
            gl.bindBuffer(gl.ARRAY_BUFFER, lengthSoFarBuffer);
            attribLocation = gl.getAttribLocation(programDashed, 'a_lengthSoFar');
            gl.enableVertexAttribArray(attribLocation);
            gl.vertexAttribPointer(
                attribLocation,
                1,
                gl.FLOAT,
                false,
                0,
                0
            );
            gl.bufferData(
                gl.ARRAY_BUFFER, 
                points[2], 
                gl.DYNAMIC_DRAW
            );

            console.log(points[2]);
        }
      
       
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, dashedTexture.length / 4, 1, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(dashedTexture));
        gl.texParameteri(
            gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.drawArrays(gl.LINE_STRIP, 0, controlPointsCount);
    }

    return { render };
};