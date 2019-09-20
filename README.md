# GLSL Linting for Visual Studio Code

This extension supports linting of GLS (OpenGL Shading Language).
It uses the [OpenGL and OpenGL ES shader validator](https://github.com/KhronosGroup/glslang)

## Features

- Linting GLSL Shader files
- Supporting [glslify](https://github.com/glslify/glslify)

## Requirements

- Visual Studio Code 1.34.0
- The [Shader languages support for VS Code](https://marketplace.visualstudio.com/items?itemName=slevesque.shader) extension
- The [OpenGL and OpenGL ES shader validator](https://github.com/KhronosGroup/glslang)

## Extension Settings

This extension contributes the following settings:

- `glsllint.glslangValidatorPath`: The path to the glslangValidator executable
- `glsllint.glslangValidatorArgs`: Arguments for the glslangValidator executable

## [Release Notes](CHANGELOG.md)
