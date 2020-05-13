const glsl1 = `
  // example from: https://github.com/hughsk/glsl-noise

  precision mediump float;

  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

  varying vec3 position;

  // And just treat them as functions like
  // you normally would:
  void main() {
    gl_FragColor = vec4(vec3(snoise3(position)), 1.0);
  }
`;

// some js code
console.log('do anything');

const glsl2 = `
// example from: https://github.com/hughsk/glsl-noise

precision mediump float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

varying vec3 position;

// And just treat them as functions like
// you normally would:
void main() {
  gl_FragColor = vec4(vec3(snoise3(position)), 1.0);
}
`;
