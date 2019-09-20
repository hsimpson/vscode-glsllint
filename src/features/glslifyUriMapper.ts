import * as vscode from 'vscode';

export class GLSLifyUriMapper {
  private static _instance: GLSLifyUriMapper;
  private _map: Map<string, string>;

  private constructor() {
    this._map = new Map<string, string>();
  }

  public static getInstance(): GLSLifyUriMapper {
    if (!GLSLifyUriMapper._instance) {
      GLSLifyUriMapper._instance = new GLSLifyUriMapper();
    }

    return GLSLifyUriMapper._instance;
  }

  public static add(uri: vscode.Uri, content: string): void {
    GLSLifyUriMapper.getInstance()._map.set(uri.toString(), content);
  }

  public static get(uri: vscode.Uri): string {
    const ret = GLSLifyUriMapper.getInstance()._map.get(uri.toString());
    return ret || '';
  }
}
