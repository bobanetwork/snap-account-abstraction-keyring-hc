import React, { useEffect, useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { NetworkManager } from './NetworkManager';
import { loadAccountConnected } from '../utils/snap';

export const WalletContainer: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const checkWalletConnection = async () => {
    try {
      const connectedAccount = await loadAccountConnected();
      setAccount(connectedAccount);
      setIsWalletConnected(true);
    } catch (error) {
      setIsWalletConnected(false);
      setAccount(null);
    }
  };

  useEffect(() => {
    // Check initial connection
    checkWalletConnection();

    // Listen for account changes
    window.ethereum?.on('accountsChanged', (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[0] === 'string') {
        setAccount(accounts[0]);
        setIsWalletConnected(true);
      } else {
        setAccount(null);
        setIsWalletConnected(false);
      }
    });
  }, []);

  const handleConnect = async () => {
    try {
      await checkWalletConnection();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleNetworkChange = () => {
    // Refresh wallet connection state after network change
    checkWalletConnection();
  };

  if (!isWalletConnected) {
    return <WelcomeScreen onConnectClick={handleConnect} />;
  }

  return (
    <NetworkManager
      isWalletConnected={isWalletConnected}
      onNetworkChange={handleNetworkChange}
    />
  );
};
