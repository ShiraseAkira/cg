precision lowp float;

attribute vec2 a_coord;
attribute vec2 a_scale;
attribute float a_lengthSoFar;

varying float v_lengthSoFar;

void main() {
    gl_Position = vec4(
        a_coord.x * a_scale.x,
        a_coord.y * a_scale.y,
        0,
        1
    );
    v_lengthSoFar = a_lengthSoFar;
}