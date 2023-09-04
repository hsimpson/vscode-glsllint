#version 300 es

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

in vec3 a_position;

out vec4 v_color;

void main() {
  v_color = vec4(1.0, 0.0, 0.0, 1.0);
  gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4( a_position, 1.0 );
}
