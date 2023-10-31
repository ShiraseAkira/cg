export async function initPhysics(body1, body2) {
    const bodies = [body1, body2];
    const G = 500;
    let isSimulating = false;
    let hasExploded = false;

    function getData() {
        return { earth: bodies[0], moon: bodies[1], state: isSimulating, hasExploded: hasExploded };
    }

    function updateBody(body, distanceVecNorm, force) {
        if (isSimulating) {
            const acceleration = force / body.mass;
            body.x += body.vx / 10;
            body.y += body.vy / 10;
            body.vx += distanceVecNorm[0] * acceleration;
            body.vy += distanceVecNorm[1] * acceleration;
        }
    }

    function tick() {
        const distanceVec = [bodies[1].x - bodies[0].x, bodies[1].y - bodies[0].y];
        const R = Math.sqrt(distanceVec[0] * distanceVec[0] + distanceVec[1] * distanceVec[1]);

        if (R < (bodies[0].size + bodies[1].size) / 2) {
            hasExploded = true;
        }

        const distanceVecNorm = [distanceVec[0] / R, distanceVec[1] / R];
        const force = G * bodies[0].mass * bodies[1].mass / (R * R);

        updateBody(bodies[0], distanceVecNorm, force);
        updateBody(bodies[1], distanceVecNorm.map(el => el * -1), force);
    }

    function toggleSimulation() {
        isSimulating = !isSimulating;
    }

    function getSimulationState() {
        return isSimulating;
    }

    function setBodies(bodyArr) {
        bodies[0] = bodyArr[0];
        bodies[1] = bodyArr[1];
        hasExploded = false;
    }

    return { getData , tick, toggleSimulation, getSimulationState, setBodies };
};