precision lowp float;

varying float v_lengthSoFar;
uniform sampler2D u_pattern;
#define NumDashes 0.05
void main() {
    gl_FragColor = texture2D(
      u_pattern, 
      vec2(fract(v_lengthSoFar * NumDashes)), 0.5);
}