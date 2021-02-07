import { Diagnostic } from 'vscode';
import Glslang from '@webgpu/glslang';

export async function glslangLint(source: string, stage: string, includePath: boolean | string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  const compiler = await Glslang();
  const result = compiler.compileGLSL(source, 'vertex', true, '1.3');

  return diagnostics;
}
