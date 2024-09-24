import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ENCRYPTION_KEY_NAME = 'encryptionKey';

type SnapState = Record<string, unknown>;

async function getOrCreateEncryptionKey(): Promise<Buffer> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as SnapState | null;

  if (state && typeof state[ENCRYPTION_KEY_NAME] === 'string') {
    return Buffer.from(state[ENCRYPTION_KEY_NAME], 'hex');
  }

  const newKey = randomBytes(32); // 256 bits
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: { [ENCRYPTION_KEY_NAME]: newKey.toString('hex') }
    },
  });

  return newKey;
}

export async function encrypt(text: string): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function decrypt(text: string): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
