#version 450
#include "preamble.glsl"

layout(location = 0) in vec3 Position;
layout(location = 1) in vec2 TexCoord;

layout(location = 0) out vec2 vTexCoord;

void main() {
    gl_Position = vec4(Position, 1.0);
    vTexCoord = TexCoord;
}