# GLSL Linting for Visual Studio Code

This extension supports linting of GLS (OpenGL Shading Language).
It uses the [OpenGL and OpenGL ES shader validator](https://github.com/KhronosGroup/glslang)
Every shader type which is supported by the glslangValidator can be validated.

## Features

- Linting GLSL Shader files
- Supporting [glslify](https://github.com/glslify/glslify)
- [Linting Shader code in string literals](#shader-code-in-string-literals)

## Requirements

- Visual Studio Code 1.34.0
- The [Shader languages support for VS Code](https://marketplace.visualstudio.com/items?itemName=slevesque.shader) extension
- The [OpenGL and OpenGL ES shader validator](https://github.com/KhronosGroup/glslang)

## Extension Settings

This extension contributes the following settings:

- `glsllint.glslangValidatorPath`: The path to the glslangValidator executable
- `glsllint.glslangValidatorArgs`: Arguments for the glslangValidator executable
- `glsllint.additionalStageAssociations`: Additonal file extension -> glslangValidator stage mapping.
  Format: `".EXT": "STAGEID"`, example:
- `supportedLangsWithStringLiterals`: VSCode language id"s to support for string literal validation

```json
"glsllint.additionalStageAssociations": {
  ".fs": "frag",
  ".vs": "vert"
}
```

Built-in mappings:

```json
{
  ".vert": "vert", // for a vertex shader
  ".vs": "vert", // for a vertex shader
  ".frag": "frag", // for a fragment shader
  ".fs": "frag", // for a fragment shader
  ".gs": "geom", // for a geometry shader
  ".geom": "geom", // for a geometry shader
  ".comp": "comp", // for a compute shader
  ".tesc": "tesc", // for a tessellation control shader
  ".tese": "tese", // for a tessellation evaluation shader
  ".rgen": "rgen", // for a ray generation shader
  ".rint": "rint", // for a ray intersection shader
  ".rahit": "rahit", // for a ray any hit shader
  ".rchit": "rchit", // for a ray closest shader
  ".rmiss": "rmiss", // for a ray miss shader
  ".rcall": "rcall", // for a ray callable shader
  ".mesh": "mesh", // for a mesh shader
  ".task": "task" // for a task shader
}
```

Available stages:

```json
["vert", "frag", "geom", "comp", "tesc", "tese", "rgen", "rint", "rahit", "rchit", "rmiss", "rcall", "mesh", "task"]
```

## Shader code in string literals

- This is supported in .js, .jsx, .ts, .tsx
- Just write the shader code in string literals either single/double qoutes or backticks (no expression interpolation yet!)
- The stage is tried to detected automatically, if this fails then just put a #pragma into the shader string literal code: `#pragma vscode_glsllint_stage : STAGE`

Example:

```javascript
const shader_code = `
    #version 460 core

    #pragma vscode_glsllint_stage : frag //pragma to set STAGE to 'frag'

    out vec4 FragColor;

    in vec4 color;

    void main(void) {
      FragColor = color;
    }
`;
```

## [Release Notes](CHANGELOG.md)
