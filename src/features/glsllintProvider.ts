import * as child_process from 'child_process';
import * as fs from 'fs';
import * as glslify from 'glslify';
import * as os from 'os';
import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';
import { stageExpressions } from './glslStageExpression';
import { GLSLifyProvider } from './glslifyProvider';
import { GLSLifyUriMapper } from './glslifyUriMapper';

enum glslValidatorFailCodes {
  ESuccess = 0,
  EFailUsage,
  EFailCompile,
  EFailLink,
  EFailCompilerCreate,
  EFailThreadCreate,
  EFailLinkerCreate,
}

enum MessageSeverity {
  Info,
  Warning,
  Error,
}

interface StringLiteral {
  text: string;
  startLine: number;
  //end: number;
  stage: string;
}

interface LanguageSetting {
  parser: 'TSAST' | 'REGEX';
  patternStart?: string;
  patternEnd?: string;
}

export class GLSLLintingProvider {
  //private static commandId: string = 'glsllint.runCodeAction';
  private command: vscode.Disposable;
  private diagnosticCollection: vscode.DiagnosticCollection;
  private readonly ENV_RESOLVE_REGEX = /\$\{(.*?)\}/g;
  private readonly config = vscode.workspace.getConfiguration('glsllint');
  private readonly GLSLIFIED_SUFFIX = '(glslified)';

  public activate(subscriptions: vscode.Disposable[]): void {
    //this.command = vscode.commands.registerCommand(GLSLLintingProvider.commandId, this.runCodeAction, this);
    subscriptions.push(this);
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

    vscode.workspace.onDidOpenTextDocument(this.doLint, this, subscriptions);
    vscode.workspace.onDidCloseTextDocument(
      (textDocument) => {
        this.diagnosticCollection.delete(textDocument.uri);
      },
      null,
      subscriptions,
    );

    vscode.workspace.onDidSaveTextDocument(this.doLint, this);

    vscode.workspace.textDocuments.forEach(this.doLint, this);
  }

  public dispose(): void {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.command.dispose();
  }

  private showMessage(msg: string, severity: MessageSeverity): void {
    const showMsg = `GLSL Lint: ${msg}`;

    switch (severity) {
      case MessageSeverity.Info:
        vscode.window.showInformationMessage(showMsg);
        break;
      case MessageSeverity.Warning:
        vscode.window.showWarningMessage(showMsg);
        break;
      case MessageSeverity.Error:
        vscode.window.showErrorMessage(showMsg);
    }
  }

  private getValidatorPath(): string {
    let glslangValidatorPath = this.config.glslangValidatorPath;

    if (glslangValidatorPath === null || glslangValidatorPath === '') {
      glslangValidatorPath = 'glslangValidator';
      if (process.platform === 'win32') {
        glslangValidatorPath += '.exe';
      }
    }

    // try to replace the env variables in glslangValidatorPath
    // format: "glsllint.glslangValidatorPath": "${env:MY_ENV}/path/to/glslangValidator"
    glslangValidatorPath = glslangValidatorPath.replace(this.ENV_RESOLVE_REGEX, (match: string, variable: string) => {
      const parts = variable.split(':');
      let resolved = variable;
      if (parts.length > 1) {
        const argument = parts[1];
        const env = process.env[argument];
        switch (parts[0]) {
          case 'env': // only support 'env' for environment substitution for the moment
            if (env) {
              resolved = env;
            } else {
              this.showMessage(`GLSL Lint: Failed to resolve environment variable '${argument}'`, MessageSeverity.Error);
            }
            break;
          default:
            this.showMessage(
              `GLSL Lint: Resolving via '${variable}' is not supported, only 'env:YOUR_ENV_VARIABLE' is supported.`,
              MessageSeverity.Error,
            );
            break;
        }
      }

      return resolved;
    });

    /*
    try {
      fs.accessSync(glslangValidatorPath, fs.constants.R_OK);
    } catch (error) {
      this.showMessage(
        `GLSL Lint: glslangValidator binary is not available:
        ${error.message}
        Please check your glsllint.glslangValidatorPath setting.`,
        MessageSeverity.Error
      );
      return '';
    }
    */

    return glslangValidatorPath;
  }

  /**
   * get all string literals (even ES6 template literals) from the TypeScript compiler node (recursive)
   */
  private getStringLiteralsTSAST(inputNode: ts.Node, currentLiterals: StringLiteral[], sourceFile: ts.SourceFile): StringLiteral[] {
    // hints about TS AST: https://ts-ast-viewer.com
    // process a file which contains string literals (e.g. JavaScript or TypeScript)
    /*
      const tsProgram = ts.createProgram([textDocument.fileName], { allowJs: true });
      const sourceFile = tsProgram.getSourceFile(textDocument.fileName);
      */

    // check for generic!
    let stringLiterals: StringLiteral[] = currentLiterals;
    ts.forEachChild(inputNode, (currentNode: ts.Node) => {
      /*
      console.log(`kind: ${currentNode.kind}`);
      console.log(`text: "${currentNode.getFullText(sourceFile)}"`);
      */
      if (currentNode.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral || currentNode.kind === ts.SyntaxKind.StringLiteral) {
        stringLiterals.push({
          text: (currentNode as ts.LiteralLikeNode).text,
          startLine: sourceFile.getLineAndCharacterOfPosition(currentNode.getStart(sourceFile)).line,
          //end: currentNode.getEnd(),
          stage: 'unknown',
        });
      } else {
        stringLiterals = this.getStringLiteralsTSAST(currentNode, stringLiterals, sourceFile);
      }
    });
    return stringLiterals;
  }

  private getShaderStageFromFile(fileName: string): string {
    const stageMapping = {
      '.vert': 'vert', // for a vertex shader
      '.vs': 'vert', // for a vertex shader
      '.frag': 'frag', // for a fragment shader
      '.fs': 'frag', // for a fragment shader
      '.gs': 'geom', // for a geometry shader
      '.geom': 'geom', // for a geometry shader
      '.comp': 'comp', // for a compute shader
      '.tesc': 'tesc', // for a tessellation control shader
      '.tese': 'tese', // for a tessellation evaluation shader
      '.rgen': 'rgen', // for a ray generation shader
      '.rint': 'rint', // for a ray intersection shader
      '.rahit': 'rahit', // for a ray any hit shader
      '.rchit': 'rchit', // for a ray closest shader
      '.rmiss': 'rmiss', // for a ray miss shader
      '.rcall': 'rcall', // for a ray callable shader
      '.mesh': 'mesh', // for a mesh shader
      '.task': 'task', // for a task shader
    };

    // glslangValidator supports compound extensions now that it supports multiple
    // shader languages:
    // .glsl   for .vert.glsl, .tesc.glsl, ..., .comp.glsl compound suffixes
    // .hlsl   for .vert.hlsl, .tesc.hlsl, ..., .comp.hlsl compound suffixes
    if (fileName.endsWith('.glsl') || fileName.endsWith('.hlsl')) {
      fileName = fileName.slice(0, -5);
    }

    const additionalStageMappings = this.config.additionalStageAssociations;
    const mergedStageMappings = { ...stageMapping, ...additionalStageMappings };

    let stage: string;

    for (const [k, v] of Object.entries(mergedStageMappings)) {
      if (fileName.endsWith(k)) {
        stage = v as string;
        break;
      }
    }

    return stage;
  }

  private getShaderStageFromText(shaderCode: string): string {
    for (const shaderExp of stageExpressions) {
      if (shaderCode.match(shaderExp.expression)) {
        return shaderExp.stage;
      }
    }

    // if not automatically matched, then do a fallback via #pragma
    const pragmaRegEx = /#pragma\svscode_glsllint_stage\s*:\s*(\S*)/gm;
    const match = pragmaRegEx.exec(shaderCode);
    if (match && match.length === 2) {
      return match[1];
    }

    // if not match then show error
    const errorMsg = `The shader stage could not be determined automatically.
    Please add: 
    '#pragma vscode_glsllint_stage: STAGE'
    to the shader code. Where STAGE is a valid shader stage (e.g.: 'vert' or 'frag', see 'Available stages' in the docs)`;
    this.showMessage(errorMsg, MessageSeverity.Error);

    return 'unknown';
  }

  private getShaderLiterals(literals: StringLiteral[]): StringLiteral[] {
    const isShaderRegex = /main(.*|\s)\((.*|\s)\)/gm;

    const shaderLiterals = literals.filter((literal) => {
      // check if this literal is a shader
      if (literal.text.match(isShaderRegex)) {
        literal.stage = this.getShaderStageFromText(literal.text);
        return true;
      }
      return false;
    });

    return shaderLiterals;
  }

  private getShaderStageFromFileREGEX(fileContent: string, languageSettings: LanguageSetting): StringLiteral[] {
    const stringLiterals: StringLiteral[] = [];
    const lines = fileContent.split(/(?:\r\n|\r|\n)/g);

    const startRegEx = new RegExp(languageSettings.patternStart);
    const endRegEx = new RegExp(languageSettings.patternEnd);

    let literal = '';
    let found = false;
    let startLine = 0;

    for (let i = 0; i < lines.length; i++) {
      if (found) {
        if (endRegEx.exec(lines[i]) !== null) {
          found = false;
          stringLiterals.push({
            text: literal,
            startLine,
            stage: 'unkown',
          });
        } else {
          literal += lines[i] + '\n';
        }
      } else if (startRegEx.exec(lines[i]) !== null) {
        found = true;
        startLine = i + 1;
        literal = '';
      }
    }
    return stringLiterals;
  }

  private getStringLiterals(textDocument: vscode.TextDocument): StringLiteral[] {
    const languageSettings = this.config.languageSettings[textDocument.languageId] as LanguageSetting;
    let stringLiterals: StringLiteral[] = [];

    if (!languageSettings) {
      this.showMessage(`Language settings for languageId=${textDocument.languageId} not available.`, MessageSeverity.Error);
      return [];
    }

    const fileContent = textDocument.getText();

    if (languageSettings.parser === 'TSAST') {
      const sourceFile = ts.createSourceFile(textDocument.fileName, fileContent, ts.ScriptTarget.ES2015);
      stringLiterals = this.getStringLiteralsTSAST(sourceFile, stringLiterals, sourceFile);
    } else if (languageSettings.parser === 'REGEX') {
      stringLiterals = this.getShaderStageFromFileREGEX(fileContent, languageSettings);
    } else {
      this.showMessage(
        `glsllint.languageSettings.${textDocument.languageId}.parser (${languageSettings.parser}) is not valid`,
        MessageSeverity.Error,
      );
    }

    stringLiterals = this.getShaderLiterals(stringLiterals);
    return stringLiterals;
  }

  private useGlslify(content: string): boolean {
    const glslifyRegEx = new RegExp(this.config.glslifyPattern, 'gm');
    return glslifyRegEx.test(content);
  }

  private compileGlslify(content: string, basedir: string): string {
    try {
      return glslify.compile(content, { basedir });
    } catch (error) {
      this.showMessage(`GLSL Lint: failed to compile the glslify file!\n${error.toString()}`, MessageSeverity.Error);
      return '';
    }
  }

  private getGlslifyBaseDir(textDocument: vscode.TextDocument): string {
    if (this.config.glslifyOptions.basedir) {
      return this.config.glslifyOptions.basedir; // use the user defined base dir
    }

    if (this.config.glslifyUseCurrentFileAsBasedir) {
      return path.dirname(textDocument.fileName); // use the current file's directory
    }

    return vscode.workspace.rootPath;
  }

  private async openGlslifiedDocument(filename: string, content: string): Promise<void> {
    const glslifyUri = vscode.Uri.parse(`${GLSLifyProvider.scheme}:${filename}-${this.GLSLIFIED_SUFFIX}`);
    GLSLifyUriMapper.add(glslifyUri, content);

    const glslifyTextDocument = await vscode.workspace.openTextDocument(glslifyUri);
    await vscode.window.showTextDocument(glslifyTextDocument);
    await vscode.languages.setTextDocumentLanguage(glslifyTextDocument, 'glsl');
  }

  private async doLint(textDocument: vscode.TextDocument): Promise<void> {
    let diagnostics: vscode.Diagnostic[] = [];
    const docUri = textDocument.uri;

    if (textDocument.languageId !== 'glsl') {
      if (textDocument.languageId === 'plaintext') {
        // not supported
        return;
      }

      // check if we should support the language for string literal parsing
      if (this.config.supportedLangsWithStringLiterals.includes(textDocument.languageId)) {
        const stringLiterals = this.getStringLiterals(textDocument);

        for (const [i, literal] of stringLiterals.entries()) {
          const glslifyUsed = this.useGlslify(literal.text);
          if (glslifyUsed) {
            literal.text = this.compileGlslify(literal.text, this.getGlslifyBaseDir(textDocument));
          }

          if (literal.text !== '') {
            const literalDiagnostics = await this.lintShaderCode(literal.text, literal.stage, false);
            // correct the code ranges

            for (const literalDiagnostic of literalDiagnostics) {
              literalDiagnostic.range = new vscode.Range(
                literalDiagnostic.range.start.line + literal.startLine,
                0,
                literalDiagnostic.range.end.line + literal.startLine,
                0,
              );
            }

            if (glslifyUsed && this.config.glslifyAutoOpenOnError && literalDiagnostics.length > 0) {
              await this.openGlslifiedDocument(`${textDocument.fileName}-literal-${i}`, literal.text);
            }

            diagnostics = [...diagnostics, ...literalDiagnostics];
          }
        }
      } else {
        return;
      }
    } else {
      if (textDocument.fileName.endsWith(this.GLSLIFIED_SUFFIX)) {
        // skip
        return;
      }

      let fileContent = textDocument.getText();
      const glslifyUsed = this.useGlslify(fileContent);

      if (glslifyUsed) {
        fileContent = this.compileGlslify(fileContent, this.getGlslifyBaseDir(textDocument));
      }

      if (fileContent !== '') {
        const stage = this.getShaderStageFromFile(textDocument.fileName);
        const filePath = path.dirname(textDocument.fileName);
        diagnostics = await this.lintShaderCode(fileContent, stage, filePath);

        if (glslifyUsed && this.config.glslifyAutoOpenOnError && diagnostics.length > 0) {
          await this.openGlslifiedDocument(path.basename(textDocument.fileName), fileContent);
        }
      }
    }

    this.diagnosticCollection.set(docUri, diagnostics);
  }

  private willCreateSPIRVBinary(args: string[]): boolean {
    if (args.includes('-G') || args.includes('-V') || args.includes('--client') || args.includes('--target-env')) {
      return true;
    }

    return false;
  }

  private async lintShaderCode(source: string, stage: string, includePath: boolean | string): Promise<vscode.Diagnostic[]> {
    return new Promise<vscode.Diagnostic[]>((resolve) => {
      const glslangValidatorPath = this.getValidatorPath();

      const diagnostics: vscode.Diagnostic[] = [];

      // Split the arguments string from the settings
      const args: string[] = [];
      if (Array.isArray(this.config.glslangValidatorArgs)) {
        args.push(...this.config.glslangValidatorArgs);
      } else {
        const splitArgs = this.config.glslangValidatorArgs.split(/\s+/).filter((arg) => arg);
        const arrayMessage = splitArgs.map((arg) => `  "${arg}",`).join('\n');
        this.showMessage(
          `GLSL Lint: the setting 'glsllint.glslangValidatorArgs' as string is deprecated! Please use the array form:
          [
            ${arrayMessage}
          ]
            `,
          MessageSeverity.Warning,
        );
        args.push(...splitArgs);
      }

      if (this.config.linkShader) {
        args.push('-l');
      }

      if (!stage) {
        stage = this.config.fallBackStage;
      }

      if (!stage) {
        this.showMessage(
          `GLSL Lint: failed to detect shader stage, you can add it's extension setting 'glsllint.additionalStageAssociations' or configure a fallback stage with 'glsllint.fallBackStage'`,
          MessageSeverity.Error,
        );
      }

      args.push('--stdin');
      args.push('-S');
      args.push(stage);

      const tempFile = path.join(os.tmpdir(), `vscode-glsllint-${stage}.tmp`);
      if (this.willCreateSPIRVBinary(args)) {
        args.push('-o');
        args.push(tempFile);
      }

      if (this.config.useIncludeDirOfFile && includePath && includePath !== '') {
        args.push(`-I${includePath}`);
      }

      // FIXME: use workspaceFolders instead of rootPath
      const options = vscode.workspace.rootPath ? { cwd: vscode.workspace.rootPath } : undefined;

      console.log(`${glslangValidatorPath} ${args.join(' ')}`);

      const childProcess = child_process.spawn(glslangValidatorPath, args, options);
      childProcess.on('error', (error: Error) => {
        if (error) {
          this.showMessage(`Failed to spawn 'glslangValidator' binary. \nError: ${error.message}`, MessageSeverity.Error);
          resolve(diagnostics);
        }
      });

      let stdErrorData = '';
      let stdOutData = '';
      childProcess.stderr.on('data', (chunk) => {
        stdErrorData += chunk;
      });
      childProcess.stdout.on('data', (chunk) => {
        stdOutData += chunk;
      });
      childProcess.on('close', (exitCode) => {
        if (exitCode === glslValidatorFailCodes.EFailUsage) {
          // general error when starting glsl validator
          const message = `Wrong parameters when starting glslangValidator.
          Arguments:
          ${args.join('\n')}
          stderr:
          ${stdErrorData}
          `;
          this.showMessage(message, MessageSeverity.Error);
        } else if (exitCode !== glslValidatorFailCodes.ESuccess) {
          const lines = stdOutData.toString().split(/(?:\r\n|\r|\n)/g);
          for (const line of lines) {
            if (line !== '' && line !== 'stdin') {
              let severity: vscode.DiagnosticSeverity = undefined;

              if (line.startsWith('ERROR:')) {
                severity = vscode.DiagnosticSeverity.Error;
              }
              if (line.startsWith('WARNING:')) {
                severity = vscode.DiagnosticSeverity.Warning;
              }

              if (severity !== undefined) {
                const matches = line.match(/(WARNING|ERROR):\s+(\d|.*):(\d+):\s+(.*)/);
                if (matches && matches.length === 5) {
                  const errorline = parseInt(matches[3]);
                  const message = matches[4];
                  const range = new vscode.Range(errorline - 1, 0, errorline - 1, 0);
                  const diagnostic = new vscode.Diagnostic(range, message, severity);
                  diagnostics.push(diagnostic);
                }
              }
            }
          }
        }
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
        resolve(diagnostics);
      });

      // write into stdin pipe
      try {
        childProcess.stdin.write(source);
        childProcess.stdin.end();
      } catch (error) {
        this.showMessage(`Failed to write to STDIN \nError: ${error.message}`, MessageSeverity.Error);
      }
    });
  }
}
