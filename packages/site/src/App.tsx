import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import styled from 'styled-components';

import { Footer, Header, AlertBanner, AlertType } from './components';
import { VersionBanner } from './components/VersionBanner';
import { GlobalStyle } from './config/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
  background: ${({ theme }) => theme.colors.background?.default};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 2rem;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 0 1rem;
  }
`;

const BannerWrapper = styled.div`
  padding-top: 2.5rem;
  padding-left: 5%;
  padding-right: 5%;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  // Make sure we are on a browser, otherwise we can't use window.ethereum.
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <ContentWrapper>
          <Header />
          <VersionBanner />
          {children}
        </ContentWrapper>
        <Footer />
      </Wrapper>
    </>
  );
};
