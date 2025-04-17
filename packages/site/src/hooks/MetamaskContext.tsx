import type { Dispatch, ReactNode, Reducer } from 'react';
import React, { createContext, useEffect, useReducer } from 'react';

import type { Snap } from '../types';
import { hasMetaMask, getSnap, isConnectedNetworkBoba } from '../utils';

export type MetamaskState = {
  hasMetaMask: boolean;
  isMetaMaskConnected: boolean;
  installedSnap?: Snap;
  isBobaSepolia: boolean;
  error?: Error;
};

const initialState: MetamaskState = {
  hasMetaMask: false,
  isMetaMaskConnected: false,
  isBobaSepolia: false,
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<
  [MetamaskState, Dispatch<MetamaskDispatch>]
>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetNetwork = 'SetNetwork',
  SetMetaMaskDetected = 'SetMetaMaskDetected',
  SetMetaMaskConnected = 'SetMetaMaskConnected',
  SetError = 'SetError',
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetNetwork:
      return {
        ...state,
        isBobaSepolia: action.payload,
      };
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };
    case MetamaskActions.SetMetaMaskDetected:
      return {
        ...state,
        hasMetaMask: action.payload,
      };
    case MetamaskActions.SetMetaMaskConnected:
      return {
        ...state,
        isMetaMaskConnected: action.payload,
      };
    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const detectInstallation = async () => {
      // Detect if MetaMask is installed
      const isMetaMaskDetected = await hasMetaMask();
      dispatch({
        type: MetamaskActions.SetMetaMaskDetected,
        payload: isMetaMaskDetected,
      });

      if (isMetaMaskDetected && window.ethereum) {
        // Check if already connected
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const isConnected = Array.isArray(accounts) && accounts.length > 0;
          dispatch({
            type: MetamaskActions.SetMetaMaskConnected,
            payload: isConnected,
          });

          if (isConnected) {
            // Check network
            const isBobaSepolia = isConnectedNetworkBoba();
            dispatch({
              type: MetamaskActions.SetNetwork,
              payload: isBobaSepolia,
            });

            // Check snap installation
            if (isBobaSepolia) {
              const installedSnap = await getSnap();
              dispatch({
                type: MetamaskActions.SetInstalled,
                payload: installedSnap,
              });
            }
          }
        } catch (error) {
          console.error('Error checking MetaMask connection:', error);
          dispatch({
            type: MetamaskActions.SetError,
            payload: error,
          });
        }

        // Setup event listeners
        window.ethereum.on('accountsChanged', (accounts: unknown) => {
          const isConnected = Array.isArray(accounts) && accounts.length > 0;
          dispatch({
            type: MetamaskActions.SetMetaMaskConnected,
            payload: isConnected,
          });

          if (!isConnected) {
            // Reset snap and network state when disconnected
            dispatch({
              type: MetamaskActions.SetInstalled,
              payload: undefined,
            });
            dispatch({
              type: MetamaskActions.SetNetwork,
              payload: false,
            });
          }
        });

        window.ethereum.on('chainChanged', async () => {
          const isBobaSepolia = isConnectedNetworkBoba();
          dispatch({
            type: MetamaskActions.SetNetwork,
            payload: isBobaSepolia,
          });

          // Re-check snap installation on network change
          if (isBobaSepolia) {
            const installedSnap = await getSnap();
            dispatch({
              type: MetamaskActions.SetInstalled,
              payload: installedSnap,
            });
          } else {
            dispatch({
              type: MetamaskActions.SetInstalled,
              payload: undefined,
            });
          }
        });
      }
    };

    detectInstallation().catch(console.error);

    // Cleanup
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => { });
        window.ethereum.removeListener('chainChanged', () => { });
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>
      {children}
    </MetaMaskContext.Provider>
  );
};
