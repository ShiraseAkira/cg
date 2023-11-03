export async function initPhysics(body1, body2) {
    const G = 500;
    let isSimulating = false;
    let hasExploded = false;
    let ititialBodiesState;

    function getData() {
        return { 
            earth: body1, 
            moon: body2, 
            state: isSimulating, 
            hasExploded: hasExploded 
        };
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
        const distanceVec = [body2.x - body1.x, body2.y - body1.y];
        const R = Math.sqrt(distanceVec[0] * distanceVec[0] + distanceVec[1] * distanceVec[1]);

        if (R < (body1.size + body2.size) / 2) {
            hasExploded = true;
        }

        const distanceVecNorm = [distanceVec[0] / R, distanceVec[1] / R];
        const force = G * body1.mass * body2.mass / (R * R);

        updateBody(body1, distanceVecNorm, force);
        updateBody(body2, distanceVecNorm.map(el => el * -1), force);
    }

    function toggleSimulation() {
        if(!isSimulating) {
            ititialBodiesState = [body1.x, body1.y, body1.vx, body1.vy,
                                body2.x, body2.y, body2.vx, body2.vy];
        } else {
            [body1.x, body1.y, body1.vx, body1.vy, body2.x, body2.y, body2.vx, body2.vy] = [...ititialBodiesState];
        }
        isSimulating = !isSimulating;
        hasExploded = false;
    }

    return { getData , tick, toggleSimulation};
};