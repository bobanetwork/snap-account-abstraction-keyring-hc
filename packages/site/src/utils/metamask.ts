import { MetaMaskError, MetaMaskErrorData } from '../types/metamask';
export { MetaMaskError, MetaMaskErrorData } from '../types/metamask';

/**
 * Detect if MetaMask is installed.
 * @returns true if MetaMask is installed, false otherwise.
 */
export const detectMetaMask = () => {
  return typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    window.ethereum.isMetaMask === true;
};

/**
 * Error thrown when MetaMask is not installed.
 */
export class MetaMaskNotFoundError extends Error {
  constructor () {
    super('MetaMask is not installed');
    this.name = 'MetaMaskNotFoundError';
  }
}

/**
 * Safely execute a MetaMask operation with proper error handling.
 * @param operation - The async operation to execute
 * @param errorMessage - Default error message if none is provided
 * @returns The result of the operation
 * @throws {MetaMaskNotFoundError} If MetaMask is not installed
 * @throws {MetaMaskError} If the operation fails
 */
export const safeMetaMaskOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage = 'MetaMask operation failed'
): Promise<T> => {
  if (!detectMetaMask()) {
    throw new MetaMaskNotFoundError();
  }

  try {
    return await operation();
  } catch (error: any) {
    console.error('MetaMask operation failed:', error);

    // Transform the error into a user-friendly format
    const userError = new MetaMaskError(
      error.message || errorMessage,
      error.code,
      error.data
    );

    throw userError;
  }
};
