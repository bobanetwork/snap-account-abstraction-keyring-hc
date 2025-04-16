/* eslint-disable */
import React, { useContext } from 'react';
import semver from 'semver';
import styled from 'styled-components';

import snapPackageInfo from '../../../snap/package.json';
import Logo from '../assets/boba-logo-full.svg';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap } from '../utils';
import { HeaderButtons } from './Buttons';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 3.2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 2.4rem;
  margin: 2rem auto;
  max-width: 120rem;
  width: calc(100% - 4rem);
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.2rem 1.6rem;
    margin: 1rem;
    width: calc(100% - 2rem);
    border-radius: 1.6rem;
  }
`;

const BobaLogo = styled.img`
  width: 100px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  margin: 0;
  margin-left: 1.2rem;
  color: ${({ theme }) => theme.colors.text?.default};

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border-radius: 1.2rem;
  background: ${({ isConnected, theme }) =>
    isConnected ? theme.colors.success?.muted : theme.colors.error?.muted};
  color: ${({ isConnected, theme }) =>
    isConnected ? theme.colors.success?.default : theme.colors.error?.default};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &::before {
    content: '';
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: ${({ isConnected, theme }) =>
  isConnected
    ? theme.colors.success?.default
    : theme.colors.error?.default};
  }

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 0.6rem 1rem;
  }
`;

const NetworkButton = styled.button`
  background: ${({ theme }) => theme.colors.background?.alternative};
  color: ${({ theme }) => theme.colors.text?.default};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  padding: 0.8rem 1.2rem;
  border-radius: 1.2rem;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  min-height: unset;

  &:hover {
    background: ${({ theme }) => theme.colors.background?.default};
    border-color: ${({ theme }) => theme.colors.primary?.default};
    color: ${({ theme }) => theme.colors.primary?.default};
  }

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 0.6rem 1rem;
  }
`;

export const Header = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const updateAvailable = Boolean(
    state?.installedSnap &&
      semver.gt(snapPackageInfo.version, state.installedSnap?.version),
  );

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <BobaLogo src={Logo} alt="Boba Network Logo" />
      </LogoWrapper>
      <Title>AA HC Wallet</Title>
      <RightContainer>
        <NetworkButton>Boba Sepolia</NetworkButton>
        <ConnectionStatus isConnected={Boolean(state.installedSnap)}>
          {state.installedSnap !== null ? 'Connected' : 'Not Connected'}
        </ConnectionStatus>
        <HeaderButtons
          state={state}
          onConnectClick={handleConnectClick}
          updateAvailable={updateAvailable}
        />
      </RightContainer>
    </HeaderWrapper>
  );
};
