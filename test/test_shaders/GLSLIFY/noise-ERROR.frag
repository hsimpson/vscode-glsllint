// example from: https://github.com/hughsk/glsl-noise

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

varying vec3 position;

// And just treat them as functions like
// you normally would:
void main() {
  gl_FragColor = vec4(snoise3(position), 1.0);
}
