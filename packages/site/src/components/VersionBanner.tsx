/* eslint-disable*/
import React, { useContext } from 'react';
import styled from 'styled-components';
import snapPackageInfo from '../../../snap/package.json';
import { MetaMaskContext } from '../hooks';
import { defaultSnapOrigin } from '../config';

const BannerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  padding: 1.2rem;
  margin: 0 auto 2.4rem;
  max-width: 120rem;
  width: 80%;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1rem;
    gap: 1rem;
    margin-bottom: 1.6rem;
  }
`;

const VersionTag = styled.div<{ variant?: 'success' | 'error' | 'default' }>`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-radius: 0.8rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return theme.colors.success?.muted;
      case 'error':
        return theme.colors.error?.muted;
      default:
        return theme.colors.background?.alternative;
    }
  }};
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return theme.colors.success?.default;
      case 'error':
        return theme.colors.error?.default;
      default:
        return theme.colors.text?.default;
    }
  }};
  border: 1px solid
    ${({ theme, variant }) => {
      switch (variant) {
        case 'success':
          return theme.colors.success?.default;
        case 'error':
          return theme.colors.error?.default;
        default:
          return theme.colors.border?.default;
      }
    }};

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 0.6rem 1rem;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

export const VersionBanner: React.FC = () => {
  const [state] = useContext(MetaMaskContext);
  const isLocal = defaultSnapOrigin.startsWith('local');
  const installedVersion = state.installedSnap?.version;
  const expectedVersion = snapPackageInfo.version;
  const hasUpdate = installedVersion && expectedVersion !== installedVersion;

  return (
    <BannerWrapper>
      {isLocal && <VersionTag>Local Snap</VersionTag>}
      <VersionTag>Expected Snap: v{expectedVersion}</VersionTag>
      <VersionTag
        variant={installedVersion ? (hasUpdate ? 'error' : 'success') : 'error'}
      >
        {installedVersion ? `Installed Snap: v${installedVersion}` : 'Not Installed'}
      </VersionTag>
    </BannerWrapper>
  );
};
