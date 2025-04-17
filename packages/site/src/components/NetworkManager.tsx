import React from 'react';
import styled from 'styled-components';

import { Card } from './Card';

const NetworkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 60%;
  margin: 0 auto;
`;

const NetworkButton = styled.button<{ isActive?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  font-weight: 500;
`;

const NetworkGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
`;

export type NetworkManagerProps = {
  currentNetwork: string;
  onNetworkChange: (network: string) => void;
};

const SUPPORTED_NETWORKS = {
  'Boba Mainnet': '0xa',
  'Boba Sepolia': '0x1c',
};

export const NetworkManager: React.FC<NetworkManagerProps> = ({
  currentNetwork,
  onNetworkChange,
}) => {
  return (
    <NetworkContainer>
      <Card
        fullWidth={true}
        content={{
          title: 'Select Network',
          description: 'Please select a supported network to continue.',
          button: (
            <NetworkGrid>
              {Object.entries(SUPPORTED_NETWORKS).map(([name, chainId]) => (
                <NetworkButton
                  key={chainId}
                  isActive={currentNetwork === chainId}
                  onClick={() => onNetworkChange(chainId)}
                >
                  Connect to {name}
                </NetworkButton>
              ))}
            </NetworkGrid>
          ),
        }}
      />
    </NetworkContainer>
  );
};
