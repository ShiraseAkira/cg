precision lowp float;

attribute vec2 a_coord;
attribute vec2 a_scale;

uniform float u_size;
uniform vec4 u_color;

varying vec4 v_color;

void main() {
    gl_Position = vec4(
        a_coord.x * a_scale.x,
        a_coord.y * a_scale.y,
        0,
        1
    );
    gl_PointSize = u_size;
    v_color = u_color;
}
