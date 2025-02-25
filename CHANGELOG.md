# Change Log

All notable changes to the "vscode-glsllint" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.9.1]

### Added

- Since https://github.com/KhronosGroup/glslang/pull/3614, glslangValidator now outputs the error column as well. If `--error-column` is given among `glslangValidatorArgs`, then glsllint will display glsl errors under the correct column, not just at the start of the line

## [1.9.x]

### Added

- Enhance `glslangValidatorArgs` to be used as array or string [#76](https://github.com/hsimpson/vscode-glsllint/issues/76)

## [1.8.1]

### Fixed

- Detection of shaders in string literals does not work with some strings [#68](https://github.com/hsimpson/vscode-glsllint/issues/68)

## [1.8.x]

### Added

- Optional fallback stage to configure [#44](https://github.com/hsimpson/vscode-glsllint/issues/44)

## [1.7.x]

### Added

- Save SPIR-V files to $TEMP [#38](https://github.com/hsimpson/vscode-glsllint/issues/38)

### Fixed

- Only use -o for temp file when a specific SPIR-V binary option is turned on [#42](https://github.com/hsimpson/vscode-glsllint/issues/42)

## [1.6.x]

### Added

- Publish this extension under a new publisher

## [1.5.x]

### Added

- Support glslify current file as basedir [#35](https://github.com/hsimpson/vscode-glsllint/issues/35)

### Fixed

- Update packages (security fixes)

## [1.4.x]

### Fixed

- Set scope for `glslangValidatorPath` to machine so it could not be overwritten from workspace

## [1.3.x]

### Added

- Support compound suffixes like .glsl and .hlsl [#30](https://github.com/hsimpson/vscode-glsllint/issues/30)

## [1.2.x]

### Fixed

- Shader stage mapping [#3](https://github.com/hsimpson/vscode-glsllint/issues/3)

## [1.1.0]

### Added

- Allow configuring glslify options via extension settings [#19](https://github.com/cadenasgmbh/vscode-glsllint/issues/19)
- Allow disabling auto-open of (glslified) file on error [#20](https://github.com/cadenasgmbh/vscode-glsllint/issues/20)

## [1.0.0]

### Added

- Support string literals in other languages like ELM [#14](https://github.com/cadenasgmbh/vscode-glsllint/issues/14)
- Support glslify in string literals[#18](https://github.com/hsimpson/vscode-glsllint/issues/18)

## [0.0.13]

### Added

- Support automatically linking and include path of current file [#16](https://github.com/cadenasgmbh/vscode-glsllint/issues/16)

### Fixed

- Linting again after code is fixed and have no errors [#17](https://github.com/cadenasgmbh/vscode-glsllint/issues/17)

## [0.0.12]

### Fixed

- Support for empty glsllint.glslangValidatorPath setting, then it must be available in \$PATH [#10](https://github.com/cadenasgmbh/vscode-glsllint/issues/10) this was broken on Windows

## [0.0.11]

### Fixed

- Linter not working when used `-l` because output error format is different [#15](https://github.com/cadenasgmbh/vscode-glsllint/issues/15)

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
