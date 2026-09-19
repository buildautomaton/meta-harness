import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createUi } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';
import '@buildautomaton/ui-runtime/design/tokens.css';

const { App } = createUi({ plugins: productDirectorUiSet() });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
