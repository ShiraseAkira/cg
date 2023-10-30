export async function initCurve(controlPoints) {
    const points = 100;
    const f32a_controlPoints = new Float32Array(8);
    const f32a_linePoints = new Float32Array(points * 2);

    function updateCurve(controlPoints) {
        for (let p_idx = 0; p_idx < controlPoints.length; p_idx++) {
            f32a_controlPoints[p_idx * 2 + 0] = controlPoints[p_idx].x;
            f32a_controlPoints[p_idx * 2 + 1] = controlPoints[p_idx].y;
        }

        for (let i = 0; i < points; i++) {
            const t = i / (points - 1);

            f32a_linePoints[i * 2 + 0] = 
                Math.pow((1 - t), 3) * Math.pow(t, 0) * f32a_controlPoints[0] + 
                Math.pow((1 - t), 2) * Math.pow(t, 1) * f32a_controlPoints[2] * 3 + 
                Math.pow((1 - t), 1) * Math.pow(t, 2) * f32a_controlPoints[4] * 3 + 
                Math.pow((1 - t), 0) * Math.pow(t, 3) * f32a_controlPoints[6];

            f32a_linePoints[i * 2 + 1] = 
            Math.pow((1 - t), 3) * Math.pow(t, 0) * f32a_controlPoints[1] + 
            Math.pow((1 - t), 2) * Math.pow(t, 1) * f32a_controlPoints[3] * 3 + 
            Math.pow((1 - t), 1) * Math.pow(t, 2) * f32a_controlPoints[5] * 3 + 
            Math.pow((1 - t), 0) * Math.pow(t, 3) * f32a_controlPoints[7];
        }
    }

    updateCurve(controlPoints);

    function getData() {
        return [f32a_controlPoints, f32a_linePoints];
    }

    return { getData, updateCurve };
};