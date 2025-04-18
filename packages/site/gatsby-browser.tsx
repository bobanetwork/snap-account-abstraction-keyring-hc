import type { GatsbyBrowser } from 'gatsby';
import React, { StrictMode } from 'react';

import { App } from './src/App';
import { Root } from './src/Root';
import ErrorBoundary from './src/components/ErrorBoundary';

export const onClientEntry = () => {
  // Disable Gatsby's default error overlay
  if (process.env.NODE_ENV === 'development') {
    window.___navigate = () => { };
  }
};

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => (
  <StrictMode>
    <ErrorBoundary>
      <Root>{element}</Root>
    </ErrorBoundary>
  </StrictMode>
);

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
}) => <App>{element}</App>;
