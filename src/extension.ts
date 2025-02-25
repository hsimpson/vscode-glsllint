// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { GLSLLintingProvider } from './features/glsllintProvider';
import { GLSLifyProvider } from './features/glslifyProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  const glslifyProvider = new GLSLifyProvider();
  const providerRegistrations = vscode.Disposable.from(
    vscode.workspace.registerTextDocumentContentProvider(GLSLifyProvider.scheme, glslifyProvider),
  );

  const linter = new GLSLLintingProvider();
  linter.activate(context.subscriptions);
  //vscode.languages.registerCodeActionsProvider('glsl', linter);

  context.subscriptions.push(providerRegistrations);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  // do nothing here
}
