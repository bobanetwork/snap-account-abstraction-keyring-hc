/* eslint-disable no-useless-catch */
import { bytesToHex, hexToBytes } from '@metamask/utils';
// Changed from 80 to 32 bytes (256 bits) for AES-GCM
const ENCRYPTION_KEY_LENGTH = 32;

export async function getOrCreateEncryptionKey(): Promise<Uint8Array> {
  try {
    const state = await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    });
    // If we have a stored key, verify it's valid before returning
    if (state?.encryptionKey) {
      const key = hexToBytes(state.encryptionKey as string);
      // Verify key length
      if (key.length !== ENCRYPTION_KEY_LENGTH) {
        throw new Error('Invalid stored key length');
      }
      // verify it's valid for AES-GCM
      await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, [
        'encrypt',
      ]);
      return key;
    }

    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      },
    });

    const key = hexToBytes(entropy.slice(2, 66));
    await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, [
      'encrypt',
    ]);
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: {
          ...state,
          encryptionKey: bytesToHex(key),
        },
      },
    });

    return key;
  } catch (error) {
    throw error;
  }
}

export async function encrypt(data: string): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  const iv = new Uint8Array(16);
  crypto.getRandomValues(iv);
  const ivHex = bytesToHex(iv);

  const dataBytes = new TextEncoder().encode(data);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );
  const encryptedBytes = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cryptoKey,
    dataBytes,
  );

  const encryptedHex = bytesToHex(new Uint8Array(encryptedBytes));
  return `${ivHex}:${encryptedHex}`;
}

export async function decrypt(encryptedData: string): Promise<string> {
  const [ivHex, dataHex] = encryptedData.split(':');
  if (!ivHex || !dataHex) {
    throw new Error('Invalid encrypted data format');
  }
  const key = await getOrCreateEncryptionKey();
  const iv = hexToBytes(ivHex);
  const encryptedBytes = hexToBytes(dataHex);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );
  const decryptedBytes = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cryptoKey,
    encryptedBytes,
  );

  return new TextDecoder().decode(decryptedBytes);
}
