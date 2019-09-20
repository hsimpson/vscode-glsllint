import * as vscode from 'vscode';
import { GLSLifyUriMapper } from './glslifyUriMapper';

export class GLSLifyProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  public static scheme = 'glslif';

  constructor() {}

  dispose() {
    this._onDidChange.dispose();
  }

  public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    return GLSLifyUriMapper.get(uri);
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }
}
