/**
 * This is an example JavaScript file which can contain GLSL code in string literals
 * Every GLSL code block is valid and should not throw validation errors
 */

const glsl = `
  uniform mat4 u_projectionMatrix;
  uniform mat4 u_viewMatrix;
  uniform mat4 u_modelMatrix;

  attribute vec3 a_position;

  varying vec4 v_color;

  void main() {
    v_color = vec4(1.0, 0.0, 0.0, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4( a_position, 1.0 );
  }
`;

const no_shader = 'Lorem Ipsum';

const also_no_shader = 'Lorem Ipsum';

// other code
const foo = (param) => {
  return param + 1;
};

function bar(param) {
  const another_shader = `
    #version 460 core

    out vec4 FragColor;

    in vec4 color;

    void main(void) {
      FragColor = color;
    }
  `;
}
