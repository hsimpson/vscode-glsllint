#version 300 es

precision highp float;

// input from vertex shader
in vec3 vColor;
out vec4 outPutColor;


void main()
{
  outPutColor = vec4(vec3(vColor), 1.0);
}
