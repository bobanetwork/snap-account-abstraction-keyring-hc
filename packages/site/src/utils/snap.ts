import snapPackageInfo from '../../../snap/package.json';
import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';

// Network configuration type
type NetworkConfig = {
  chainId: string;
  hexChainId: string;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl: string;
};

// Network configurations
const NETWORKS: Record<string, NetworkConfig> = {
  local: {
    chainId: '901',
    hexChainId: '0x385',
    chainName: 'Boba Local',
    rpcUrl: 'http://localhost:9545',
    blockExplorerUrl: '',
  },
  mainnet: {
    chainId: '288',
    hexChainId: '0x120',
    chainName: 'Boba Mainnet',
    rpcUrl: 'wss://gateway.tenderly.co/public/boba-ethereum',
    blockExplorerUrl: 'https://bobascan.com',
  },
  sepolia: {
    chainId: '28882',
    hexChainId: '0x70d2',
    chainName: 'Boba Sepolia',
    rpcUrl: 'https://sepolia.boba.network',
    blockExplorerUrl: 'https://testnet.bobascan.com',
  },
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

export const switchToNetwork = async (
  networkType: 'local' | 'mainnet' | 'sepolia',
) => {
  const network = NETWORKS[networkType];
  if (!network) {
    throw new Error('invalid network');
  }
  const currentChain = window.ethereum.networkVersion;

  if (currentChain !== network.chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: network.hexChainId,
          },
        ],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: network.hexChainId,
              chainName: network.chainName,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: [network.blockExplorerUrl],
            },
          ],
        });
      }
    }
  }
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
// Separate snap connection function that doesn't force network switching
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {
    version: snapPackageInfo.version,
  },
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

// Utility function that combines network switching and snap connection
export const connectSnapWithNetwork = async (
  networkType: 'local' | 'mainnet' | 'sepolia',
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {
    version: snapPackageInfo.version,
  },
) => {
  await switchToNetwork(networkType);
  await connectSnap(snapId, params);
};

export const loadAccountConnected = async () => {
  const accounts: any = await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [],
  });
  return accounts[0];
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'snap.internal.hello' },
    },
  });
};

/**
 * Invokes a Snap method with the specified parameters.
 * @param method - The method to invoke.
 * @param params - Optional parameters for the method.
 * @returns A promise that resolves to the result of the Snap method invocation.
 */
const walletInvokeSnap = async (method: string, params?: JSON) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method, params },
    },
  });
};

/**
 * Toggle paymaster usage.
 */
export const togglePaymasterUsage = async () => {
  await walletInvokeSnap('snap.internal.togglePaymasterUsage');
};

export const isUsingPaymaster = async (): Promise<boolean> => {
  return (await walletInvokeSnap('snap.internal.isUsingPaymaster')) as boolean;
};

// /**
//  * Checks if the current chain is configured by retrieving the chain ID from the Ethereum provider and
//  * comparing it with the chain configurations obtained from the wallet's Snap plugin.
//  * @returns A promise that resolves to a boolean indicating whether the current chain is configured.
//  */
// export const isCurrentChainConfigured = async (): Promise<boolean> => {
//   const currentChainId = (await window.ethereum.request({
//     method: 'eth_chainId',
//   })) as string;
//   const configs = (await walletInvokeSnap('snap.getConfigs')) as ChainConfigs;

//   const chainConfig = configs[currentChainId];

//   if (!chainConfig) {
//     return false;
//   }

//   return (
//     chainConfig.simpleAccountFactory !== '' &&
//     chainConfig.entryPoint !== '' &&
//     chainConfig.bundlerUrl !== ''
//   );
// };

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

export const isConnectedNetworkBoba = () => {
  const currentChain = window.ethereum.networkVersion;
  return currentChain === '28882';
};
