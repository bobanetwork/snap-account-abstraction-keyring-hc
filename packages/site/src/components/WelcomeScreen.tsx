import React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import Logo from '../assets/boba-logo-full.svg';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const BobaLogo = styled.img`
  width: 200px;
  margin-bottom: 2rem;
`;

const ConnectButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.05)')};
  }
`;

export interface WelcomeScreenProps {
  onConnectClick: () => void;
  hasMetaMask: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onConnectClick,
  hasMetaMask,
}) => {
  return (
    <WelcomeContainer>
      {/* <BobaLogo src={Logo} alt="Boba Network Logo" /> */}
      <Card
        content={{
          title: 'Welcome to Boba Account Abstraction',
          description: hasMetaMask
            ? 'Get started by connecting your MetaMask wallet.'
            : 'Please install MetaMask to continue.',
          button: (
            <ConnectButton
              onClick={onConnectClick}
              disabled={!hasMetaMask}
            >
              {hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask'}
            </ConnectButton>
          ),
        }}
        disabled={!hasMetaMask}
      />
    </WelcomeContainer>
  );
};
