#version 460

layout(location=0) in vec2 pos;
layout(location=1) in vec3 color;

layout(binding=0,set=0) uniform Transformation{
    mat4 model;
    mat4 proj;
    mat4 view;
}camera;
layout(binding=0,set=1) uniform test{
    int testInt;
    float testFloat;
}tester;

layout(location=0) out vec3 vertColor;

void main(){
    gl_Position = camera.proj * camera.view * camera.model * vec4(pos,0,1);
    // gl_Position = camera.proj * camera.view * camera.model * vec4(pos,1);
    vertColor = color; 
}
