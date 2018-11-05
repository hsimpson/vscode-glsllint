precision highp float;

// input from vertex shader
varying vec3 vColor;


void main()
{
  gl_FragColor = vec4(vec3(vColor), 1.0);
}
