import { ethers } from 'ethers';

export class SecurePrivateKey {
  #wallet: ethers.Wallet | null;

  constructor(key: string | Buffer) {
    if (Buffer.isBuffer(key)) {
      this.#wallet = new ethers.Wallet(ethers.hexlify(key));
    } else {
      this.#wallet = new ethers.Wallet(key);
    }
  }

  async sign(message: string | Uint8Array): Promise<string> {
    return this.#wallet!.signMessage(message);
  }

  async getAddress(): Promise<string> {
    return this.#wallet!.address;
  }

  async encrypt(password: string): Promise<string> {
    return this.#wallet!.encrypt(password);
  }

  destroy(): void {
    this.#wallet = null;
    if (global.gc) {
      global.gc();
    }
  }

  async getPrivateKey(): Promise<string> {
    return this.#wallet!.privateKey;
  }
}
