import * as vscode from 'vscode';
import { GLSLifyUriMapper } from './glslifyUriMapper';

export class GLSLifyProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  public static scheme = 'glslif';

  public dispose(): void {
    this._onDidChange.dispose();
  }

  public provideTextDocumentContent(uri: vscode.Uri, _token: vscode.CancellationToken): vscode.ProviderResult<string> {
    return GLSLifyUriMapper.get(uri);
  }

  public get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }
}
