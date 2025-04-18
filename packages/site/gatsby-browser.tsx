import type { GatsbyBrowser } from 'gatsby';
import React from 'react';

import { App } from './src/App';
import { Root } from './src/Root';
import ErrorBoundary from './src/components/ErrorBoundary';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => (
  <ErrorBoundary>
    <Root>{element}</Root>
  </ErrorBoundary>
);

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
}) => <App>{element}</App>;
