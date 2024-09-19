import type { JsonTx } from '@ethereumjs/tx';
import { stripHexPrefix } from '@ethereumjs/util';
import type { Json } from '@metamask/utils';
import { hexlify } from 'ethers';

import type { Wallet } from '../keyring';

/**
 * Serializes a transaction by removing undefined properties and converting them to null.
 *
 * @param tx - The transaction object.
 * @param type - The type of the transaction.
 * @returns The serialized transaction.
 */
export function serializeTransaction(tx: JsonTx, type: number): Json {
  const serializableSignedTx: Record<string, any> = {
    ...tx,
    type,
  };
  // Make tx serializable
  // toJSON does not remove undefined or convert undefined to null
  Object.entries(serializableSignedTx).forEach(([key, _]) => {
    if (serializableSignedTx[key] === undefined) {
      delete serializableSignedTx[key];
    }
  });

  return serializableSignedTx;
}

/**
 * Hexlify all members of object, recursively.
 *
 * @param obj - The object to hexlify.
 * @returns The hexlified object.
 */
export function deepHexlify(obj: any): any {
  if (typeof obj === 'function') {
    return undefined;
  }
  if (obj === null || typeof obj === 'string' || typeof obj === 'boolean') {
    return obj;
  } else if (obj._isBigNumber !== null || typeof obj !== 'object') {
    return hexlify(obj).replace(/^0x0/u, '0x');
  }
  if (Array.isArray(obj)) {
    return obj.map((member) => deepHexlify(member));
  }
  return Object.keys(obj).reduce(
    (set, key) => ({
      ...set,
      [key]: deepHexlify(obj[key]),
    }),
    {},
  );
}

/**
 * Validates whether there are no duplicate addresses in the provided array of wallets.
 *
 * @param address - The address to validate for duplication.
 * @param wallets - The array of wallets to search for duplicate addresses.
 * @returns Returns true if no duplicate addresses are found, otherwise false.
 */
export function isUniqueAddress(address: string, wallets: Wallet[]): boolean {
  return !wallets.find((wallet) => wallet.account.address === address);
}

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
}

/**
 * Runs the specified callback and throws an error with the specified message
 * if it fails.
 *
 * This function should be used to run code that may throw error messages that
 * could expose sensitive information.
 *
 * @param callback - Callback to run.
 * @param message - Error message to throw if the callback fails.
 * @returns The result of the callback.
 */
export function runSensitive<Type>(
  callback: () => Type,
  message?: string,
): Type {
  try {
    return callback();
  } catch (error) {
    throw new Error(message ?? 'An unexpected error occurred');
  }
}

export const getSignerPrivateKey = async (index: number) => {
  try {
    return stripHexPrefix(
      await snap.request({
        method: 'snap_getEntropy',
        params: {
          version: 1,
          salt: `signer_${index}`,
        },
      }),
    );
  } catch (e) {
    throw new Error(`Failed to get signer private key for index ${index}`);
  }
};


interface FetchWrapperOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  backoffFactor?: number;
}

export const fetchWithRetry = async (url: string, options: FetchWrapperOptions = {}): Promise<Response> => {
  const {
    timeout = 10000,
    retries = 3,
    backoffFactor = 2,
    ...fetchOptions
  } = options;

  let lastError: Error = new Error();

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;

    } catch (error: any) {
      lastError = error;

      if (error.name === 'AbortError') {
        console.warn(`Request timed out (attempt ${attempt + 1} of ${retries})`);
      } else {
        console.error(`Error (attempt ${attempt + 1} of ${retries}):`, error);
      }

      if (attempt === retries - 1) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, Math.pow(backoffFactor, attempt) * 1000));
    }
  }

  throw lastError;
}
