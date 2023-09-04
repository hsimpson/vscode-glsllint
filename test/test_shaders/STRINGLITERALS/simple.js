const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

void main()
{
    gl_Position = vec4(0.0,0.0,0.0,1.0);
}`;

const fregmentShderSource = `
#version 300 es
#pragma vscode_glsllint_stage: frag
main() ERROR HERE FOR TRIGER THE VALIDATOR 
{
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}`;

const c = document.querySelector('canvas');
const gl = c.getContext('webgl2');
const program = gl.createProgram();
gl.useProgram(program);