// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  vscode.window
    .showInformationMessage(
      'This extension is deprecated.\nIt can be removed without any problems.\nShould the extension be removed now?',
      'Yes',
      'No'
    )
    .then((answer) => {
      vscode.commands.executeCommand('workbench.extensions.uninstallExtension', 'CADENAS.vscode-glsllint');
    });
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  // do nothing here
}
