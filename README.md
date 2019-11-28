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
- `glsllint.additionalStageAssociations`: Additonal file extension -> glslangValidator stage mapping.
  Format: `".EXT": "STAGEID"`, example:

```json
"glsllint.additionalStageAssociations": {
  ".fs": "frag",
  ".vs": "vert"
}
```

Built-in mappings:

```json
{
  ".vert": "vert",
  ".vs": "vert",
  ".frag": "frag",
  ".fs": "frag",
  ".gs": "geom",
  ".geom": "geom",
  ".comp": "comp",
  ".tesc": "tesc",
  ".tese": "tese",
  ".rgen": "rgen",
  ".rint": "rint",
  ".rahit": "rahit",
  ".rchit": "rchit",
  ".rmiss": "rmiss",
  ".rcall": "rcall",
  ".mesh": "mesh",
  ".task": "task"
}
```

Available stages:

```json
["vert", "frag", "geom", "comp", "tesc", "tese", "rgen", "rint", "rahit", "rchit", "rmiss", "rcall", "mesh", "task"]
```

## [Release Notes](CHANGELOG.md)
