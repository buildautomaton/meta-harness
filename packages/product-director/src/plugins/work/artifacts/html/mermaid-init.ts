import { MERMAID_BOX_CSS } from './mermaid-css.js';
import { mermaidThemeVars } from './mermaid-vars.js';

export const mermaidInit = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  darkMode: true,
  themeVariables: mermaidThemeVars,
  themeCSS: MERMAID_BOX_CSS,
  flowchart: {
    curve: 'basis',
    padding: 24,
    htmlLabels: true,
    nodeSpacing: 64,
    rankSpacing: 72,
    wrappingWidth: 220,
  },
};
