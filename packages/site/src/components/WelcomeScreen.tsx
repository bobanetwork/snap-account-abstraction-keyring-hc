import React from 'react';
import styled from 'styled-components';

import { Card } from './Card';
import { switchToNetwork } from '../utils/snap';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const ConnectButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export type WelcomeScreenProps = {
  onConnectClick: () => Promise<void>;
  hasMetaMask: boolean;
  currentNetwork?: string;
  onNetworkChange?: (network: 'mainnet' | 'sepolia') => Promise<void>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onConnectClick,
  hasMetaMask,
  currentNetwork,
  onNetworkChange,
}) => {
  const handleNetworkSwitch = async (networkType: 'mainnet' | 'sepolia') => {
    try {
      await switchToNetwork(networkType);
      onNetworkChange?.(networkType);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const isMainnet = currentNetwork === '0x120'; // Boba Mainnet
  const isSepolia = currentNetwork === '0x70d2'; // Boba Sepolia

  return (
    <WelcomeContainer>
      <Card
        content={{
          title: 'Welcome to Boba Account Abstraction',
          description: hasMetaMask
            ? 'Get started by connecting your MetaMask wallet.'
            : 'To continue, please install MetaMask.',
          button: (
            <ButtonContainer>
              <ConnectButton onClick={onConnectClick} disabled={!hasMetaMask}>
                {hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask'}
              </ConnectButton>
              {!hasMetaMask
                ? currentNetwork && (
                    <ConnectButton
                      variant="secondary"
                      onClick={async () =>
                        handleNetworkSwitch(isMainnet ? 'sepolia' : 'mainnet')
                      }
                    >
                      Switch to {isMainnet ? 'Sepolia' : 'Mainnet'}
                    </ConnectButton>
                  )
                : null}
            </ButtonContainer>
          ),
        }}
      />
    </WelcomeContainer>
  );
};
