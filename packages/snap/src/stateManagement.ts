import type { KeyringState } from './keyring';
import { logger } from './logger';

/**
 * Default keyring state.
 */
// remove defaultState
const defaultState: KeyringState = {
  wallets: {},
};

/**
 * Retrieves the current state of the keyring.
 *
 * @returns The current state of the keyring.
 */
export async function getState(): Promise<KeyringState> {
  try {
    const state = await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    }) as KeyringState | null;
    logger.debug('State retrieved successfully.');
    return { ...defaultState, ...state };
  } catch (error) {
    logger.error('Failed to retrieve state:', error);
    throw new Error('Could not retrieve state.');
  }
}

/**
 * Persists the given snap state.
 *
 * @param state - New snap state.
 */
export async function saveState(state: KeyringState) {
  try {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'update', newState: state },
    });
    logger.debug('State saved successfully.');
  } catch (error) {
    logger.error('Failed to save state:', error);
    throw new Error('Could not save state.');
  }
}
