'use strict';
import * as cp from 'child_process';

import * as vscode from 'vscode';

enum glslValidatorFailCodes {
  ESuccess = 0,
  EFailUsage,
  EFailCompile,
  EFailLink,
  EFailCompilerCreate,
  EFailThreadCreate,
  EFailLinkerCreate
}

export default class GLSLLintingProvider implements vscode.CodeActionProvider {
  private static commandId: string = 'glsllint.runCodeAction';
  private command: vscode.Disposable;
  private diagnosticCollection: vscode.DiagnosticCollection;

  public activate(subscriptions: vscode.Disposable[]) {
    this.command = vscode.commands.registerCommand(GLSLLintingProvider.commandId, this.runCodeAction, this);
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

  private doLint(textDocument: vscode.TextDocument): any {
    if (textDocument.languageId !== 'glsl') {
      return;
    }

    const config = vscode.workspace.getConfiguration('glsllint');
    // The code you place here will be executed every time your command is
    // executed
    if (config.glslangValidatorPath === null || config.glslangValidatorPath === '') {
      vscode.window.showErrorMessage(
        'GLSL Lint: config.glslangValidatorPath is empty, please set it to the executable'
      );
      return;
    }

    let decoded = '';
    let diagnostics: vscode.Diagnostic[] = [];

    // Split the arguments string from the settings
    let args = config.glslangValidatorArgs.split(/\s+/).filter((arg) => arg);
    args.push(textDocument.fileName);

    let options = vscode.workspace.rootPath ? { cwd: vscode.workspace.rootPath } : undefined;

    let childProcess = cp.spawn(config.glslangValidatorPath, args, options);
    if (childProcess.pid) {
      childProcess.stdout.on('data', (data: Buffer) => {
        decoded += data;
      });
      childProcess.on('close', (exitcode: number) => {
        let lines = decoded.toString().split(/(?:\r\n|\r|\n)/g);

        if (exitcode == glslValidatorFailCodes.EFailUsage) {
          // general error when starting glsl validator
          const message = 'Wrong parameters when starting glslangValidator.\nArguments:\n' + args.join('\n');
          vscode.window.showErrorMessage(message);
        } else {
          lines.forEach((line) => {
            if (line !== '') {
              let severity: vscode.DiagnosticSeverity = undefined;

              if (line.startsWith('ERROR:')) {
                severity = vscode.DiagnosticSeverity.Error;
              }
              if (line.startsWith('WARNING:')) {
                severity = vscode.DiagnosticSeverity.Warning;
              }

              if (severity !== undefined) {
                let matches = line.match(/WARNING:|ERROR:\s.+?(?=:(\d)+):(\d*): (\W.*)/);
                if (matches && matches.length == 4) {
                  let message = matches[3];
                  let errorline = parseInt(matches[2]);
                  let range = new vscode.Range(errorline - 1, 0, errorline - 1, 0);
                  let diagnostic = new vscode.Diagnostic(range, message, severity);
                  diagnostics.push(diagnostic);
                }
              }
            }
          });
        }
        this.diagnosticCollection.set(textDocument.uri, diagnostics);
      });
    }
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Command[]> {
    throw new Error('Method not implemented.');
  }

  private runCodeAction(document: vscode.TextDocument, range: vscode.Range, message: string): any {
    throw new Error('Method not implemented.');
  }
}
