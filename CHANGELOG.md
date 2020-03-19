# Change Log

All notable changes to the "vscode-glsllint" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.10]

### Fixed

- Ship typescript with the extension [#13](https://github.com/cadenasgmbh/vscode-glsllint/issues/13)

## [0.0.9]

### Fixed

- Support for empty glsllint.glslangValidatorPath setting, then it must be available in \$PATH [#10](https://github.com/cadenasgmbh/vscode-glsllint/issues/10)

## [0.0.8]

### Added

- Support for shader code in string literals [#6](https://github.com/cadenasgmbh/vscode-glsllint/issues/6)

## [0.0.7]

### Fixed

- Add missing file extension to stage mappings (.rgen, .rint, .rahit, .rchit, .rmiss, .rcall, .mesh, .task) [#7](https://github.com/cadenasgmbh/vscode-glsllint/issues/7)

### Added

- Support configuration of file extension to stage mappings [#7](https://github.com/cadenasgmbh/vscode-glsllint/issues/7)

## [0.0.6]

### Added

- Support environment variables [#5](https://github.com/cadenasgmbh/vscode-glsllint/issues/5)
- Support glslify [#4](https://github.com/cadenasgmbh/vscode-glsllint/issues/4)

## [0.0.5]

### Added

- Additional file extensions supported by glslangValidator (.vert, .tesc, .tese, .geom, .frag, .comp, .rgen, .rint, .rahit, .rchit, .rmiss, .rcall, .mesh, .task) [#3](https://github.com/cadenasgmbh/vscode-glsllint/issues/3)

### Fixed

- Error handling when a call to glslangValidator fails

## [0.0.4]

### Fixed

- Cannot use this extension with vulkan glsl files [#1](https://github.com/cadenasgmbh/vscode-glsllint/issues/1)

## [0.0.3]

### Changed

- Nothing only building for market place

## [0.0.2]

### Added

- Depends on the extension [Shader languages support for VS Code](https://marketplace.visualstudio.com/items?itemName=slevesque.shader)

### Fixed

- Linting when open a file

## [0.0.1]

### Added

- Initial release
