#include <iostream>

int main() {
  std::cout << "hello world!" << std::endl;

  std::string vertexShader = R"glsl(
  
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;

    attribute vec3 a_position;

    varying vec4 v_color;

    void main() {
      v_color = vec4(1.0, 0.0, 0.0, 1.0);
      gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4( a_position, 1.0 );
    }

  )glsl";



  std::string fragmentShader = R"glsl(
  
    precision highp float;

    // input from vertex shader
    varying vec3 vColor;


    void main()
    {
      gl_FragColor = vec4(vec3(vColor), 1.0);
    }

  )glsl";

  std::cout << "--- vertex shader BEGIN ---" << std::endl;
  std::cout << vertexShader << std::endl;
  std::cout << "--- vertex shader END---" << std::endl;

  std::cout << "--- fragment shader BEGIN ---" << std::endl;
  std::cout << fragmentShader << std::endl;
  std::cout << "--- fragment shader END---" << std::endl;

  return 0;
}
