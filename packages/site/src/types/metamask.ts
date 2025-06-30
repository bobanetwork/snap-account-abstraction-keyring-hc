export class MetaMaskError extends Error {
  code: number | undefined;
  data: unknown;

  constructor (message: string, code?: number, data?: unknown) {
    super(message);
    this.name = 'MetaMaskError';
    this.code = code;
    this.data = data;
  }
}
