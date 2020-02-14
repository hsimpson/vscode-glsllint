interface StageExpression {
  stage: string;
  expression: RegExp;
}

export const stageExpressions: StageExpression[] = [
  { stage: 'vert', expression: /gl_Position\s*=/gm }, // for a vertex shader
  /*
   * fragment shader detection only works for:
   * - GLSL <= 1.20
   * - GLSL ES <= 1.00
   */
  { stage: 'frag', expression: /gl_FragColor\s*=|gl_FragDepth\s*=|gl_FragData\s*\[.*\]\s*=/gm } // for a fragment shader
  /*
  { stage: 'geom', expression: / /gm }, // for a geometry shader
  { stage: 'comp', expression: / /gm }, // for a compute shader
  { stage: 'tesc', expression: / /gm }, // for a tessellation control shader
  { stage: 'tese', expression: / /gm }, // for a tessellation evaluation shader
  { stage: 'rgen', expression: / /gm }, // for a ray generation shader
  { stage: 'rint', expression: / /gm }, // for a ray intersection shader
  { stage: 'rahit', expression: / /gm }, // for a ray any hit shader
  { stage: 'rchit', expression: / /gm }, // for a ray closest shader
  { stage: 'rmiss', expression: / /gm }, // for a ray miss shader
  { stage: 'rcall', expression: / /gm }, // for a ray callable shader
  { stage: 'mesh', expression: / /gm }, // for a mesh shader
  { stage: 'task', expression: / /gm } // for a task shader
  */
];
