import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createUi } from './core/create-ui.js';
import { workUiPlugin } from './plugins/work/plugin.js';
import './design/tokens.css';

const { App } = createUi({ plugins: [workUiPlugin()] });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
