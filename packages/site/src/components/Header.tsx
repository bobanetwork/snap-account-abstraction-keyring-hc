/* eslint-disable */
import React, { useContext } from 'react';
import semver from 'semver';
import styled from 'styled-components';

import snapPackageInfo from '../../../snap/package.json';
import Logo from '../assets/boba-logo-full.svg';
import { MetaMaskContext, MetamaskState } from '../hooks';
import { switchToNetwork } from '../utils';

const NetworkSwitchButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;

  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

`;

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

const getNetworkName = (chainId?: string) => {
  switch (chainId) {
    case '0x70d2': // 28882
      return 'Boba Sepolia';
    case '0x120': // 288
      return 'Boba Mainnet';
    default:
      return 'Unsupported Network';
  }
};

const getConnectionStatus = (state: MetamaskState) => {
  if (!state.hasMetaMask) {
    return 'MetaMask Not Found';
  }
  if (!state.isMetaMaskConnected) {
    return 'Not Connected';
  }
  if (!state.isBobaSepolia && !state.isBobaMainnet) {
    return 'Wrong Network';
  }
  if (!state.installedSnap) {
    return 'Snap Not Installed';
  }
  return `Connected to ${getNetworkName(state.currentNetwork)}`;
};

export const Header = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleNetworkChange = async (networkType: 'mainnet' | 'sepolia') => {
    try {
      await switchToNetwork(networkType);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const updateAvailable = Boolean(
    state?.installedSnap &&
    semver.gt(snapPackageInfo.version, state.installedSnap?.version),
  );

  const isFullyConnected = Boolean(
    state.hasMetaMask &&
    state.isMetaMaskConnected &&
    (state.isBobaSepolia || state.isBobaMainnet) &&
    state.installedSnap
  );

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <BobaLogo src={Logo} alt="Boba Network Logo" />
        <Title>AA HC Wallet</Title>
      </LogoWrapper>
      <RightContainer>
        {isFullyConnected && <NetworkSwitchButton
          onClick={() => handleNetworkChange(state.isBobaMainnet ? 'sepolia' : 'mainnet')}
        >
          Switch to {state.isBobaMainnet ? 'Sepolia' : 'Mainnet'}
        </NetworkSwitchButton>}
        {/* {isFullyConnected && (
          <NetworkStatus>
            {getNetworkName(state.currentNetwork)}
          </NetworkStatus>
        )} */}
        <ConnectionStatus isConnected={isFullyConnected}>
          {getConnectionStatus(state)}
        </ConnectionStatus>
      </RightContainer>
    </HeaderWrapper>
  );
};
