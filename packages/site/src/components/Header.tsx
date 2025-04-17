/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';
import semver from 'semver';
import styled from 'styled-components';

import snapPackageInfo from '../../../snap/package.json';
import Logo from '../assets/boba-logo-full.svg';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap, isConnectedNetworkBoba } from '../utils';
import { HeaderButtons } from './Buttons';
import { AlertBanner, AlertType } from './AlertBanner';

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
  isConnected ? theme.colors.success?.default : theme.colors.error?.default};
  }

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 0.6rem 1rem;
  }
`;

const NetworkStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border-radius: 1.2rem;
  background: ${({ theme }) => theme.colors.background?.alternative};
  color: ${({ theme }) => theme.colors.text?.default};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
`;

export const Header = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [currentNetwork, setCurrentNetwork] = useState<string>('');

  const updateAvailable = Boolean(
    state?.installedSnap &&
      semver.gt(snapPackageInfo.version, state.installedSnap?.version),
  );

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (typeof chainId === 'string') {
            setCurrentNetwork(chainId);
          }
        } catch (error) {
          console.error('Error checking network:', error);
        }
      }
    };

    checkNetwork();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: unknown) => {
        if (typeof chainId === 'string') {
          setCurrentNetwork(chainId);
        }
      });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', () => { });
      }
    };
  }, []);

  const handleConnectClick = async () => {
    try {
      if (!state.isMetaMaskConnected) {
        // First connect MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        dispatch({
          type: MetamaskActions.SetMetaMaskConnected,
          payload: true,
        });
      }

      // Then connect snap if on correct network
      if (isConnectedNetworkBoba()) {
        await connectSnap();
        const installedSnap = await getSnap();
        dispatch({
          type: MetamaskActions.SetInstalled,
          payload: installedSnap,
        });
      }
    } catch (error) {
      console.error('Error connecting:', error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const getNetworkName = () => {
    switch (currentNetwork) {
      case '0x70d2': // 28882
        return 'Boba Sepolia';
      case '0x120': // 288
        return 'Boba Mainnet';
      default:
        return 'Unsupported Network';
    }
  };

  const getConnectionStatus = () => {
    if (!state.hasMetaMask) {
      return 'MetaMask Not Found';
    }
    if (!state.isMetaMaskConnected) {
      return 'Not Connected';
    }
    if (!state.isBobaSepolia) {
      return 'Wrong Network';
    }
    if (!state.installedSnap) {
      return 'Snap Not Installed';
    }
    return 'Connected';
  };

  const isFullyConnected = Boolean(
    state.hasMetaMask &&
    state.isMetaMaskConnected &&
    state.isBobaSepolia &&
    state.installedSnap
  );

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <BobaLogo src={Logo} alt="Boba Network Logo" />
        <Title>AA HC Wallet</Title>
      </LogoWrapper>
      <RightContainer>
        {isFullyConnected && <NetworkStatus>
          {getNetworkName()}
        </NetworkStatus>}
        <ConnectionStatus isConnected={isFullyConnected}>
          {getConnectionStatus()}
        </ConnectionStatus>
        {/* <HeaderButtons
          state={state}
          onConnectClick={handleConnectClick}
          updateAvailable={updateAvailable}
        /> */}
      </RightContainer>
    </HeaderWrapper>
  );
};
