import * as child_process from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';
import * as glslify from 'glslify';
import { GLSLifyProvider } from './glslifyProvider';
import { GLSLifyUriMapper } from './glslifyUriMapper';

enum glslValidatorFailCodes {
  ESuccess = 0,
  EFailUsage,
  EFailCompile,
  EFailLink,
  EFailCompilerCreate,
  EFailThreadCreate,
  EFailLinkerCreate
}

export class GLSLLintingProvider /*implements vscode.CodeActionProvider*/ {
  private static commandId: string = 'glsllint.runCodeAction';
  private command: vscode.Disposable;
  private diagnosticCollection: vscode.DiagnosticCollection;

  public activate(subscriptions: vscode.Disposable[]) {
    //this.command = vscode.commands.registerCommand(GLSLLintingProvider.commandId, this.runCodeAction, this);
    subscriptions.push(this);
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

    vscode.workspace.onDidOpenTextDocument(this.doLint, this, subscriptions);
    vscode.workspace.onDidCloseTextDocument(
      (textDocument) => {
        this.diagnosticCollection.delete(textDocument.uri);
      },
      null,
      subscriptions
    );

    vscode.workspace.onDidSaveTextDocument(this.doLint, this);

    vscode.workspace.textDocuments.forEach(this.doLint, this);
  }

  public dispose(): void {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.command.dispose();
  }

  private doLint(textDocument: vscode.TextDocument): void {
    if (textDocument.languageId !== 'glsl') {
      return;
    }

    const glsifiedSuffix = '(glslified)';

    if (textDocument.fileName.endsWith(glsifiedSuffix)) {
      // skip
      return;
    }

    const config = vscode.workspace.getConfiguration('glsllint');
    // The code you place here will be executed every time your command is
    // executed
    if (config.glslangValidatorPath === null || config.glslangValidatorPath === '') {
      vscode.window.showErrorMessage(
        'GLSL Lint: config.glslangValidatorPath is empty, please set it to the executable!'
      );
      return;
    }

    let fileContent = textDocument.getText();

    const glslifyRegEx = new RegExp(config.glslifyPattern, 'gm');
    const glslifyUsed = glslifyRegEx.test(fileContent);

    if (glslifyUsed) {
      try {
        fileContent = glslify.file(textDocument.fileName);
      } catch (error) {
        vscode.window.showErrorMessage(`GLSL Lint: failed to compile the glslify file!\n${error.toString()}`);
        return;
      }
    }

    // Split the arguments string from the settings
    let args = config.glslangValidatorArgs.split(/\s+/).filter((arg) => arg);
    //args.push(textDocument.fileName);
    const extension = path.extname(textDocument.fileName);

    const stageMapping = {
      '.vs': 'vert',
      '.vert': 'vert',
      '.fs': 'frag',
      '.frag': 'frag',
      '.gs': 'geom',
      '.geom': 'geom',
      '.comp': 'comp',
      '.tesc': 'tesc',
      '.tese': 'tese'
    };

    const stage = stageMapping[extension] || 'unkown';

    args.push('--stdin');
    args.push('-S');
    args.push(stage);

    let options = vscode.workspace.rootPath ? { cwd: vscode.workspace.rootPath } : undefined;

    let childProcess = child_process.spawn(config.glslangValidatorPath, args, options);
    // childProcess.stdin.write('void main() {}\n');
    childProcess.stdin.write(fileContent);
    childProcess.stdin.end();
    if (childProcess.pid) {
      let decoded = '';
      childProcess.stdout.on('data', (data: Buffer) => {
        decoded += data;
      });
      childProcess.on('close', async (exitcode: number) => {
        let diagnostics: vscode.Diagnostic[] = [];
        let lines = decoded.toString().split(/(?:\r\n|\r|\n)/g);

        if (exitcode === glslValidatorFailCodes.EFailUsage) {
          // general error when starting glsl validator
          const message = 'Wrong parameters when starting glslangValidator.\nArguments:\n' + args.join('\n');
          vscode.window.showErrorMessage(message);
        } else if (exitcode !== glslValidatorFailCodes.ESuccess) {
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
                let matches = line.match(/WARNING:|ERROR:\s.+?(?=:(\d)+):(\d*): (\W.*)/);
                if (matches && matches.length === 4) {
                  let message = matches[3];
                  let errorline = parseInt(matches[2]);
                  let range = new vscode.Range(errorline - 1, 0, errorline - 1, 0);
                  let diagnostic = new vscode.Diagnostic(range, message, severity);
                  diagnostics.push(diagnostic);
                }
              }
            }
          }
        }

        if (glslifyUsed && diagnostics.length) {
          const glslifyFileName = path.basename(textDocument.fileName);
          const glslifyUri = vscode.Uri.parse(`${GLSLifyProvider.scheme}:${glslifyFileName}-${glsifiedSuffix}`);
          GLSLifyUriMapper.add(glslifyUri, fileContent);

          const glslifyTextDocument = await vscode.workspace.openTextDocument(glslifyUri);
          await vscode.window.showTextDocument(glslifyTextDocument);
          await vscode.languages.setTextDocumentLanguage(glslifyTextDocument, 'glsl');
          this.diagnosticCollection.set(glslifyUri, diagnostics);
        } else {
          this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
      });
    }
  }

  /*
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    throw new Error('provideCodeActions Method not implemented.');
  }

  private runCodeAction(document: vscode.TextDocument, range: vscode.Range, message: string): any {
    throw new Error('runCodeAction Method not implemented.');
  }
  */
}
