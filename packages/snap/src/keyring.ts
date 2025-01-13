/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import {
  addHexPrefix,
  Address,
  isValidPrivate,
  toChecksumAddress,
} from '@ethereumjs/util';
import type {
  EthBaseTransaction,
  EthBaseUserOperation,
  EthUserOperation,
  Keyring,
  KeyringAccount,
  KeyringRequest,
  SubmitRequestResponse,
} from '@metamask/keyring-api';
import {
  emitSnapKeyringEvent,
  EthAccountType,
  EthMethod,
  KeyringEvent,
} from '@metamask/keyring-api';
import type { NodeType } from '@metamask/snaps-sdk';
import {
  copyable,
  DialogType,
  heading,
  panel,
  text,
} from '@metamask/snaps-sdk';
import type { CaipChainId, Json } from '@metamask/utils';
import { hexToBytes, parseCaipChainId } from '@metamask/utils';
import { Buffer } from 'buffer';
import type { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

import { AA_CONFIG } from './constants/aa-config';
import { CHAIN_IDS } from './constants/chain-ids';
import {
  DUMMY_SIGNATURE,
  getDummyPaymasterAndData,
} from './constants/dummy-values';
import { encrypt, decrypt } from './encryption';
import { logger } from './logger';
import { InternalMethod } from './permissions';
import { SecurePrivateKey } from './secureKey';
import { saveState } from './stateManagement';
import {
  EntryPoint__factory,
  SimpleAccount__factory,
  SimpleAccountFactory__factory,
} from './types';
import { CaipNamespaces, isEvmChain, toCaipChainId } from './utils/caip';
import { getUserOperationHash } from './utils/ecdsa';
import { getSigner, provider } from './utils/ethers';
import {
  isUniqueAddress,
  runSensitive,
  throwError,
  getSignerPrivateKey,
  fetchWithRetry,
} from './utils/util';

const unsupportedAAMethods = [
  EthMethod.SignTransaction,
  EthMethod.Sign,
  EthMethod.PersonalSign,
  EthMethod.SignTypedDataV1,
  EthMethod.SignTypedDataV3,
  EthMethod.SignTypedDataV4,
];

export type ChainConfig = {
  version: string;
  entryPoint: string;
  simpleAccountFactory: string;
  bobaPaymaster?: string;
  bobaToken?: string;
  bundlerUrl: string;
};

export type KeyringState = {
  wallets: Record<string, Wallet>;
};

export type Wallet = {
  account: KeyringAccount;
  admin: string;
  encryptedPrivateKey: string;
  chains: Record<string, boolean>;
  salt: string;
  initCode: string;
};

export const DefaultGasOverheads = {
  fixed: 21000,
  perUserOp: 18300,
  perUserOpWord: 4,
  zeroByte: 4,
  nonZeroByte: 16,
  bundleSize: 1,
  sigSize: 65,
};

export type UserOpOverrides = {
  nonce?: string;
  callGasLimitReq?: string;
  maxFeePerGasReq?: string;
  maxPriorityFeePerGasReq?: string;
  preVerificationGasReqMultiplier?: number;
};

type IUserOpGasEstimate = {
  callGasLimit: string | undefined;
  preVerificationGas: string | undefined;
  verificationGasLimit: string | undefined;
};

// eslint-disable-next-line jsdoc/require-jsdoc
export function packUserOp(op: any, forSignature = true): string {
  if (forSignature) {
    return ethers.AbiCoder.defaultAbiCoder().encode(
      // eslint-disable-next-line prettier/prettier
      [
        'address',
        'uint256',
        'bytes32',
        'bytes32',
        // eslint-disable-next-line prettier/prettier
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'bytes32',
      ],
      [
        op.sender,
        op.nonce,
        ethers.keccak256(op.initCode),
        ethers.keccak256(op.callData),
        op.callGasLimit,
        op.verificationGasLimit,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        ethers.keccak256(op.paymasterAndData),
      ],
    );

    // eslint-disable-next-line no-else-return
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return ethers.AbiCoder.defaultAbiCoder().encode(
      // eslint-disable-next-line prettier/prettier
      [
        'address',
        'uint256',
        'bytes',
        'bytes',
        // eslint-disable-next-line prettier/prettier
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'bytes',
        'bytes',
      ],
      [
        op.sender,
        op.nonce,
        op.initCode,
        op.callData,
        op.callGasLimit,
        op.verificationGasLimit,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        op.paymasterAndData,
        op.signature,
      ],
    );
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function calcPreVerificationGas(userOp: any, overheads?: any): number {
  const ov = { ...DefaultGasOverheads, ...(overheads ?? {}) };
  // eslint-disable-next-line id-length, @typescript-eslint/no-unnecessary-type-assertion
  const p = {
    // dummy values, in case the UserOp is incomplete.
    preVerificationGas: 21000, // dummy value, just for calldata cost
    signature: ethers.hexlify(Buffer.alloc(ov.sigSize, 1)), // dummy signature
    ...userOp,
  } as any;
  if (p.signature === '') {
    p.signature = ethers.hexlify(Buffer.alloc(ov.sigSize, 1));
  }
  const packed = ethers.getBytes(packUserOp(p, false));
  const lengthInWord = (packed.length + 31) / 32;
  const callDataCost = packed
    // eslint-disable-next-line id-length
    .map((x) => (x === 0 ? ov.zeroByte : ov.nonZeroByte))
    // eslint-disable-next-line id-length
    .reduce((sum, x) => sum + x);
  const ret = Math.round(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    callDataCost +
      ov.fixed / ov.bundleSize +
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ov.perUserOp +
      ov.perUserOpWord * lengthInWord,
  );
  return ret;
}

export class AccountAbstractionKeyring implements Keyring {
  #state: KeyringState;

  constructor(state: KeyringState) {
    this.#state = state;
  }

  /**
   * List all accounts in the keyring.
   *
   * @returns A list of accounts.
   */
  async listAccounts(): Promise<KeyringAccount[]> {
    return Object.values(this.#state.wallets).map((wallet) => wallet.account);
  }

  /**
   * Get an account by its ID.
   *
   * @param id - The ID of the account to retrieve.
   * @throws If the account is not found.
   * @returns The keyring account with the given ID.
   */
  async getAccount(id: string): Promise<KeyringAccount> {
    return (
      this.#state.wallets[id]?.account ??
      throwError(`Account '${id}' not found`)
    );
  }

  /**
   * Create a new smart contract keyring account.
   * Private key is required to create an account.
   *
   * @param options - The options to use when creating the account (e.g. salt).
   * @throws If the private key is not provided or if the account already exists.
   * @returns The new keyring account.
   */
  async createAccount(
    options: Record<string, Json> = {},
  ): Promise<KeyringAccount> {
    if (!options.privateKey && !options.saltIndex) {
      throwError(`[Snap] Private Key or Salt Index is required`);
    }

    const privateKeyGen =
      options?.privateKey ??
      (await getSignerPrivateKey(options.saltIndex as number));

    const { secureKey, address: admin } = this.#getKeyPair(
      privateKeyGen as string,
    );

    if (options?.privateKey) {
      delete options.privateKey;
    }

    const { chainId } = await provider.getNetwork();
    const signer = getSigner(await secureKey.getPrivateKey());

    // get factory contract by chain
    const aaFactory = await this.#getAAFactory(Number(chainId), signer);
    logger.info('[Snap] AA Factory Contract Address: ', aaFactory.target);

    const random = ethers.toBigInt(ethers.randomBytes(32));
    const salt =
      // eslint-disable-next-line no-negated-condition
      options.saltIndex !== undefined
        ? ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [0])
        : (options.salt as string) ??
          ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [random]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const aaAddress = await aaFactory['getAddress(address,uint256)'](
      admin,
      salt,
    );

    if (!isUniqueAddress(aaAddress, Object.values(this.#state.wallets))) {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `[Snap] Account abstraction address already in use: ${aaAddress}`,
      );
    }

    const initCode = ethers.concat([
      aaFactory.target as string,
      aaFactory.interface.encodeFunctionData('createAccount', [admin, salt]),
    ]);

    const encryptedPrivateKey = await encrypt(await secureKey.getPrivateKey());

    try {
      const account: KeyringAccount = {
        id: uuid(),
        options,
        address: aaAddress,
        methods: [
          // 4337 methods
          EthMethod.PrepareUserOperation,
          EthMethod.PatchUserOperation,
          // TODO - disabled until MM Flask allows 0.7 UserOperations
          // EthMethod.SignUserOperation,
        ],
        type: EthAccountType.Erc4337,
      };
      this.#state.wallets[account.id] = {
        account,
        admin,
        encryptedPrivateKey,
        chains: {
          [toCaipChainId(CaipNamespaces.Eip155, chainId.toString())]: false,
        },
        salt,
        initCode,
      };
      await this.#emitEvent(KeyringEvent.AccountCreated, { account });
      await this.#saveState();
      return account;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Filter the EVM chains that an account can be used with.
   *
   * @param _id - The ID of the account to filter chains for.
   * @param chains - CAIP-2 chain IDs to filter.
   * @returns The filtered list of EVM chains.
   */
  async filterAccountChains(_id: string, chains: string[]): Promise<string[]> {
    // The `id` argument is not used because all accounts created by this snap
    // are expected to be compatible with any EVM chain.
    return chains.filter((chain) => isEvmChain(chain));
  }

  /**
   * Update a keyring account.
   *
   * @param account - The account to update.
   * @throws if the account does not exist or if the account does not implement EIP-1271.
   */
  async updateAccount(account: KeyringAccount): Promise<void> {
    const wallet =
      this.#state.wallets[account.id] ??
      throwError(`Account '${account.id}' not found`);

    if (
      unsupportedAAMethods.some((method) => account.methods.includes(method))
    ) {
      throwError(`[Snap] Account does not implement EIP-1271`);
    }

    const newAccount: KeyringAccount = {
      ...wallet.account,
      ...account,
      // Restore read-only properties.
      address: wallet.account.address,
    };

    try {
      await this.#emitEvent(KeyringEvent.AccountUpdated, {
        account: newAccount,
      });
      wallet.account = newAccount;
      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  /**
   * Delete a keyring account.
   *
   * @param id - The ID of the account to delete.
   */
  async deleteAccount(id: string): Promise<void> {
    try {
      await this.#emitEvent(KeyringEvent.AccountDeleted, { id });
      delete this.#state.wallets[id];
      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  /**
   * Submit a request to the keyring.
   *
   * @param request - The keyring request to submit.
   * @returns The response to the request.
   */
  async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    return this.#syncSubmitRequest(request);
  }

  async #syncSubmitRequest(request: any): Promise<SubmitRequestResponse> {
    try {
      const { method, params } = request.request;
      const scope = request.scope ? request.scope : params[0].scope;
      let selectedWallet;

      // @DEV todo create one uniform way of retrieving the wallet addr
      try {
        selectedWallet = this.#getWalletByAddress(request.account);
      } catch (error) {
        selectedWallet = this.#getWalletById(request.id);
      }

      const response = await this.#handleSigningRequest({
        account: selectedWallet.account,
        method,
        params: params as Json,
        scope,
      });

      return {
        pending: false,
        result: response,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Input validation failed:', error.errors);
      }
      throw error; // Re-throw the error for higher-level error handling
    }
  }

  #getWalletById(accountId: string): Wallet {
    const wallet = this.#state.wallets[accountId];
    if (!wallet) {
      throwError(`Account '${accountId}' not found`);
    }
    return wallet;
  }

  #getWalletByAddress(address: string): Wallet {
    const walletByIdentifier = this.#state.wallets[address];
    if (!walletByIdentifier) {
      const match = Object.values(this.#state.wallets).find(
        (wallet) =>
          wallet.account.address.toLowerCase() === address.toLowerCase(),
      );
      return match ?? throwError(`Account '${address}' not found`);
    }
    return walletByIdentifier;
  }

  #getKeyPair(privateKey?: string): {
    secureKey: SecurePrivateKey;
    address: string;
  } {
    const privateKeyBuffer: Buffer = runSensitive(
      () =>
        privateKey
          ? Buffer.from(hexToBytes(addHexPrefix(privateKey)))
          : Buffer.from(crypto.getRandomValues(new Uint8Array(32))),
      'Invalid private key',
    );

    if (!isValidPrivate(privateKeyBuffer)) {
      throw new Error('Invalid private key');
    }

    const address = toChecksumAddress(
      Address.fromPrivateKey(privateKeyBuffer).toString(),
    );

    const secureKey = new SecurePrivateKey(privateKeyBuffer);

    // Zero out the buffer after use
    privateKeyBuffer.fill(0);

    return { secureKey, address };
  }

  async #handleSigningRequest({
    account,
    scope,
    method,
    params,
  }: {
    account: KeyringAccount;
    scope: string;
    method: string;
    params: Json;
  }): Promise<Json> {
    const { chainId } = await provider.getNetwork();
    try {
      const parsedScope = parseCaipChainId(scope as CaipChainId);
      if (String(chainId) !== parsedScope.reference) {
        throwError(
          `[Snap] Chain ID '${chainId}' mismatch with scope '${scope}'`,
        );
      }
    } catch (error) {
      throwError(
        `[Snap] Error parsing request scope '${scope}': ${
          (error as Error).message
        }`,
      );
    }
    if (!this.#isSupportedChain(Number(chainId))) {
      throwError(`[Snap] Unsupported chain ID: ${Number(chainId)}`);
    }
    if (!this.#doesAccountSupportChain(account.id, scope)) {
      throwError(`[Snap] Account does not support chain: ${scope}`);
    }

    // params is always an array, payload can be an array, or single tx
    let payload = (params as any)[0]?.payload;
    if (!payload) {
      payload = params;
    }
    const mapParamsToTransactions = (): EthBaseTransaction[] => {
      if (Array.isArray(payload)) {
        return payload as EthBaseTransaction[];
      }
      return [payload as EthBaseTransaction];
    };

    // Allow developers to override certain params for debugging purposes.
    const overrides: UserOpOverrides | undefined =
      payload?.overrides as UserOpOverrides; // TODO: We might want to use that object for the other RPC calls too

    switch (method) {
      case InternalMethod.SendUserOpBoba: {
        return await this.#prepareAndSignUserOperationBoba(
          account.address,
          mapParamsToTransactions(),
          '', // paymaster type
          '0x', /// paymaster address
          '0x', // fee token address
          overrides,
        );
      }

      case InternalMethod.SendUserOpBobaPM: {
        const chainConfig = this.#getChainConfig(Number(chainId));
        if (!chainConfig?.bobaPaymaster) {
          throwError(`[Snap] Paymaster not found for chain: ${chainId}`);
        }
        if (!chainConfig?.bobaToken) {
          throwError(`[Snap] Boba token not found for chain: ${chainId}`);
        }
        return await this.#prepareAndSignUserOperationBoba(
          account.address,
          mapParamsToTransactions(),
          'alt_fee',
          chainConfig.bobaPaymaster,
          chainConfig.bobaToken,
          overrides,
        );
      }

      case EthMethod.PrepareUserOperation: {
        return await this.#prepareUserOperation(
          account.address,
          mapParamsToTransactions(),
        );
      }

      case EthMethod.PatchUserOperation: {
        const [userOp] = params as [EthUserOperation];
        console.log(
          'Metamask sent UserOperation back for patching',
          JSON.stringify(userOp),
        );
        return await this.#patchUserOperation(userOp);
      }

      case EthMethod.SignUserOperation: {
        const [userOp] = params as [EthUserOperation];
        return (await this.#signUserOperation(account.address, userOp)) as Json;
      }

      default: {
        throw new Error(`EVM method '${method}' not supported`);
      }
    }
  }

  async #prepareAndSignUserOperationBoba(
    address: string,
    transactions: EthBaseTransaction[],
    paymasterType: string,
    paymasterAddr: string,
    tokenAddr: string,
    overrides?: UserOpOverrides,
  ): Promise<[any, any, EthUserOperation]> {
    if (transactions.length !== 1) {
      throwError(`[Snap] Only one transaction per UserOp supported`);
    }
    const transaction =
      transactions[0] ?? throwError(`[Snap] Transaction is required`);
    logger.info(
      `[Snap] PrepareUserOp for transaction\n: ${JSON.stringify(
        transaction,
        null,
        2,
      )}`,
    );

    const wallet = this.#getWalletByAddress(address);
    const decryptedPrivateKey = await decrypt(wallet.encryptedPrivateKey);
    const signer = getSigner(decryptedPrivateKey);

    // eslint-disable-next-line camelcase
    const aaInstance = SimpleAccount__factory.connect(
      wallet.account.address, // AA address
      signer, // Admin signer
    );

    const { chainId } = await provider.getNetwork();

    let nonce = '0x0';
    let initCode = '0x';
    try {
      if (overrides?.nonce) {
        nonce = overrides.nonce;
      } else {
        nonce = `0x${((await aaInstance.getNonce()) as BigNumberish).toString(
          16,
        )}`;
      }
      console.log('Using Nonce: ', nonce);
      if (!wallet.chains[chainId.toString()]) {
        wallet.chains[chainId.toString()] = true;
        await this.#saveState();
      }
    } catch (error) {
      initCode = wallet.initCode;
    }

    const entryPoint = await this.#getEntryPoint(Number(chainId), signer);
    const chainConfig = this.#getChainConfig(Number(chainId));
    if (!chainConfig?.bundlerUrl) {
      throwError(`[Snap] Bundler URL not found for chain: ${chainId}`);
    }

    const { to, value, data } = transaction;
    if (!to || !value || !data) {
      throwError(
        `[Snap] Transaction object invalid. Missing either to, value or data field.`,
      );
    }
    const callDataReq = aaInstance.interface.encodeFunctionData('execute', [
      to,
      value,
      data,
    ]);

    const entrypointAddr = await entryPoint.getAddress();
    let callGasLimitReq: string | bigint = 10000n;
    try {
      callGasLimitReq =
        overrides?.callGasLimitReq ??
        (await provider.estimateGas({
          from: entrypointAddr,
          to: wallet.account.address,
          data: callDataReq,
        }));
    } catch (error: any) {
      // can be safely ignored, as this is likely being overridden by the bundler reported callGasLimit
      console.error(error);
    }

    console.log('Init gas req');
    // eslint-disable-next-line prefer-template
    let initGasReq;
    if (initCode === null || initCode === '0x') {
      initGasReq = BigInt(0);
    } else {
      console.log('Estimating initCode related calldata..');
      const deployerCallDataReq = `0x${initCode.substring(42)}`;
      initGasReq = await provider.estimateGas({
        to: initCode.substring(0, 42),
        data: deployerCallDataReq,
      });
    }

    // verification gasLimit expected is 100000
    const verificationGasLimitReq = BigInt(100000) + initGasReq;

    const feeData = await provider.getFeeData();
    const maxFeePerGasReq =
      overrides?.maxFeePerGasReq ??
      feeData.maxFeePerGas ??
      BigInt('1000000000');
    const maxPriorityFeePerGasReq =
      overrides?.maxPriorityFeePerGasReq ??
      feeData.maxPriorityFeePerGas ??
      BigInt('1000000000');

    const paymasterAndDataReq = await this.#getPaymasterAndData(
      paymasterType,
      paymasterAddr,
      tokenAddr,
    );

    const partialUserOp: any = {
      sender: address,
      nonce,
      initCode,
      callData: callDataReq,
      callGasLimit: `0x${callGasLimitReq.toString(16)}`,
      verificationGasLimit: `0x${verificationGasLimitReq.toString(16)}`,
      maxFeePerGas: `0x${maxFeePerGasReq.toString(16)}`,
      maxPriorityFeePerGas: `0x${maxPriorityFeePerGasReq.toString(16)}`,
      paymasterAndData: paymasterAndDataReq,
    };

    let preVerificationGasReq = calcPreVerificationGas(partialUserOp);

    // TODO: (replace) the public bundler on sepolia expects more preVerifGas
    if (chainId.toString() === '11155111') {
      preVerificationGasReq += 10000;
    }
    preVerificationGasReq *= overrides?.preVerificationGasReqMultiplier ?? 1;

    // check if calculated preVerificationGas is adequate by calling eth_estimateUserOperationGas on the bundler here

    const ethBaseUserOp: EthUserOperation = {
      ...partialUserOp,
      preVerificationGas: `0x${preVerificationGasReq.toString(16)}`,
      signature: DUMMY_SIGNATURE,
    };

    console.log(ethBaseUserOp);
    const estimatedGas = await this.#estimateUserOpGas(
      ethBaseUserOp,
      await entryPoint.getAddress(),
      chainConfig.bundlerUrl,
    );
    if (estimatedGas.preVerificationGas) {
      const preVerificationGasBundler = parseInt(
        estimatedGas.preVerificationGas,
        16,
      );
      ethBaseUserOp.preVerificationGas = addHexPrefix(
        (preVerificationGasBundler > preVerificationGasReq
          ? preVerificationGasBundler
          : preVerificationGasReq
        ).toString(16),
      );
      console.log(
        'Preverification gas set: ',
        ethBaseUserOp.preVerificationGas,
      );
    }
    if (estimatedGas.verificationGasLimit) {
      const verificationGasLimitBundler = parseInt(
        estimatedGas.verificationGasLimit,
        16,
      );
      ethBaseUserOp.verificationGasLimit = addHexPrefix(
        (verificationGasLimitBundler > verificationGasLimitReq
          ? verificationGasLimitBundler
          : verificationGasLimitReq
        ).toString(16),
      );
      console.log(
        'Set verificationGasLimit: ',
        ethBaseUserOp.verificationGasLimit,
      );
    }
    if (estimatedGas.callGasLimit) {
      const callGasLimitBundler = parseInt(estimatedGas.callGasLimit, 16);
      ethBaseUserOp.callGasLimit = addHexPrefix(
        (callGasLimitBundler > Number(callGasLimitReq)
          ? callGasLimitBundler
          : callGasLimitReq
        ).toString(16),
      );
      console.log('Set callgas limit: ', ethBaseUserOp.callGasLimit);
    }

    let pmPayload: (
      | {
          value: string;
          type: NodeType.Copyable;
          sensitive?: boolean /* eslint-disable camelcase */ | undefined;
        }
      | { value: string; type: NodeType.Text; markdown?: boolean | undefined }
    )[] = [];
    if (paymasterType) {
      pmPayload = [text('Boba paymaster has been selected!')];
    }

    // For Funds transfer (specific tokens) modify dialog accordingly,
    // for general tx show general dialog
    const sourceAddress = address; // The address sending the transaction

    const result = await snap.request({
      method: 'snap_dialog',
      params: {
        type: DialogType.Confirmation,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        content: panel([
          heading('Transaction Confirmation'),
          text('Please review the following transaction details:'),
          text('From (Source Address):'),
          copyable(sourceAddress),
          text('To (Target Address):'),
          copyable(to),
          text('Transaction Value:'),
          copyable(value),
          text('Transaction Data:'),
          copyable(data),
          text('Network Chain ID:'),
          copyable(chainId.toString()),
          ...pmPayload,
          text('Please ensure all details are correct before confirming.'),
        ]),
      },
    });

    if (!result) {
      throw new Error(`User declined transaction!`);
    }

    ethBaseUserOp.signature = '0x';
    const userOpHash = getUserOperationHash(
      ethBaseUserOp,
      await entryPoint.getAddress(),
      chainId.toString(10),
    );

    const signedUserOp = await this.#signUserOperation(address, ethBaseUserOp);
    console.log(signedUserOp);

    ethBaseUserOp.signature = signedUserOp!;

    const bundlerRes = await this.#sendUserOperation(
      ethBaseUserOp,
      await entryPoint.getAddress(),
      chainConfig.bundlerUrl,
    );
    console.log(bundlerRes);
    if (!bundlerRes.result) {
      console.log(bundlerRes.error);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`UserOp Failed:${bundlerRes.error.message}`);
    }

    (await snap.request({
      method: 'snap_dialog',
      params: {
        type: DialogType.Alert,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        content: panel([
          heading('Transaction Success!'),
          text(`UserOP has been send to bundler: ${userOpHash} (UserOp Hash)`),
          copyable(signedUserOp),
        ]),
      },
    })) as any;

    return [{ userOpHash }, bundlerRes, ethBaseUserOp];
  }

  async #getPaymasterAndData(
    paymasterType: string,
    paymasterAddr: string, // take as config params
    tokenAddr: string,
  ): Promise<string> {
    if (paymasterType === 'alt_fee') {
      return ethers.concat([paymasterAddr, ethers.zeroPadValue(tokenAddr, 20)]);
    }
    return '0x';
  }

  async #prepareUserOperation(
    address: string,
    transactions: EthBaseTransaction[],
  ): Promise<EthBaseUserOperation> {
    if (transactions.length !== 1) {
      throwError(`[Snap] Only one transaction per UserOp supported`);
    }
    const transaction =
      transactions[0] ?? throwError(`[Snap] Transaction is required`);
    logger.info(
      `[Snap] PrepareUserOp for transaction\n: ${JSON.stringify(
        transaction,
        null,
        2,
      )}`,
    );

    const wallet = this.#getWalletByAddress(address);
    const decryptedPrivateKey = await decrypt(wallet.encryptedPrivateKey);
    const signer = getSigner(decryptedPrivateKey);

    // eslint-disable-next-line camelcase
    const aaInstance = SimpleAccount__factory.connect(
      wallet.account.address, // AA address
      signer, // Admin signer
    );

    const { chainId } = await provider.getNetwork();

    let nonce = '0x0';
    let initCode = '0x';
    try {
      nonce = `0x${((await aaInstance.getNonce()) as BigNumberish).toString(
        16,
      )}`;
      const scope = toCaipChainId(CaipNamespaces.Eip155, chainId.toString());
      if (!Object.prototype.hasOwnProperty.call(wallet.chains, scope)) {
        wallet.chains[scope] = true;
        await this.#saveState();
      }
    } catch (error) {
      initCode = wallet.initCode;
    }

    const chainConfig = this.#getChainConfig(Number(chainId));
    if (!chainConfig?.bundlerUrl) {
      throwError(`[Snap] Bundler URL not found for chain: ${chainId}`);
    }

    const ethBaseUserOp: EthBaseUserOperation = {
      nonce,
      initCode,
      callData: aaInstance.interface.encodeFunctionData('execute', [
        transaction.to ?? ethers.ZeroAddress,
        transaction.value ?? '0x00',
        transaction.data ?? ethers.ZeroHash,
      ]),
      gasLimits: {
        callGasLimit: '0x58a83',
        verificationGasLimit: '0xe8c4',
        preVerificationGas: '0xc57c',
      },
      dummySignature: DUMMY_SIGNATURE,
      dummyPaymasterAndData: getDummyPaymasterAndData(), // TODO paymaster
      bundlerUrl: chainConfig.bundlerUrl,
    };
    return ethBaseUserOp;
  }

  async #patchUserOperation(userOperation: EthUserOperation): Promise<Json> {
    const { chainId } = await provider.getNetwork();

    const chainConfig = this.#getChainConfig(Number(chainId));
    if (!chainConfig) {
      throwError(`Invalid Chain Configuration for ${Number(chainId)}`);
    }

    console.log('Estimating User Operation: ', JSON.stringify(userOperation));

    // TODO estimation is done without the paymasterAndData field
    const estimate = await this.#estimateUserOpGas(
      userOperation,
      chainConfig.entryPoint,
      chainConfig.bundlerUrl,
    );

    console.log('UserOperation estimated: ', estimate);

    return {
      // TODO paymasterAndData | No paymasterAndData for v.07 allowed but required in docs (?)
      // TODO paymasterAndData needs to be submitted to the Chain API
      paymasterAndData: '0x',
      callGasLimit: estimate.callGasLimit, // ~360k gas
      verificationGasLimit: estimate.verificationGasLimit, // ~60k gas
      preVerificationGas: estimate.preVerificationGas, // ~50k gas
    } as Json;
  }

  async #sendUserOperation(
    userOp: any,
    entryPointAddress: string,
    bundlerUrl: string,
  ) {
    const requestBody = {
      method: 'eth_sendUserOperation',
      id: 1,
      jsonrpc: '2.0',
      params: [userOp, entryPointAddress],
    };
    try {
      const response = await fetch(bundlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Response:', JSON.stringify(data));
      return data; // Return the data
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async #estimateUserOpGas(
    userOp: any,
    entryPointAddress: any,
    bundlerUrl: string,
  ): Promise<IUserOpGasEstimate> {
    // for v0.7 EntryPoint this field is not in the UserOperation RPC request
    const { chainId } = await provider.getNetwork();
    const chainConfig = this.#getChainConfig(Number(chainId));
    if (chainConfig?.version !== '0.6.0') {
      // @DEV needed for v0.7 operations
      delete userOp.paymasterAndData;

      if (userOp.initCode.length >= 42) {
        userOp.factory = userOp.initCode.substring(0, 42);
        userOp.factoryData = `0x${String(userOp.initCode).substring(42)}`;
      }
    }

    const requestBody = {
      method: 'eth_estimateUserOperationGas',
      id: 1,
      jsonrpc: '2.0',
      params: [userOp, entryPointAddress],
    };
    try {
      const response = await fetchWithRetry(bundlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Gas Estimation Response:', JSON.stringify(data));
      if (data.error?.message) {
        console.error(
          'JSON ESTIMATE: ',
          JSON.stringify(requestBody),
          requestBody,
          bundlerUrl,
        );
        // this might be a bundler related message during estimation, we must not continue and need to stop the user here
        throw new Error(data.error.message);
      }
      const resData = data?.result;
      return {
        verificationGasLimit: resData?.verificationGasLimit
          ? addHexPrefix(resData?.verificationGasLimit)
          : undefined,
        preVerificationGas: resData?.preVerificationGas
          ? addHexPrefix(resData?.preVerificationGas)
          : undefined,
        callGasLimit: resData?.callGasLimit
          ? addHexPrefix(resData?.callGasLimit)
          : undefined,
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // async #patchUserOperation(
  //   address: string,
  //   userOp: EthUserOperation,
  // ): Promise<EthUserOperationPatch> {
  //   const wallet = this.#getWalletByAddress(address);
  //   const signer = getSigner(wallet.privateKey);
  //   const { chainId } = await provider.getNetwork();
  //   const chainConfig = this.#getChainConfig(Number(chainId));

  //   const verifyingPaymasterAddress =
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  //     chainConfig?.customVerifyingPaymasterAddress!;

  //   if (!verifyingPaymasterAddress) {
  //     return { paymasterAndData: '0x' };
  //   }

  //   const verifyingPaymaster = VerifyingPaymaster__factory.connect(
  //     verifyingPaymasterAddress,
  //     signer,
  //   );

  //   const verifyingSigner = getSigner(
  //     chainConfig?.customVerifyingPaymasterSK ?? wallet.privateKey,
  //   );

  //   // Create a hash that doesn't expire
  //   const hash = await verifyingPaymaster.getHash(userOp, 0, 0);
  //   const signature = await verifyingSigner.signMessage(ethers.getBytes(hash));
  //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //   const paymasterAndData = `${await verifyingPaymaster.getAddress()}${stripHexPrefix(
  //     ethers.AbiCoder.defaultAbiCoder().encode(['uint48', 'uint48'], [0, 0]),
  //   )}${stripHexPrefix(signature)}`;

  //   return {
  //     paymasterAndData,
  //   };
  // }

  async #signUserOperation(
    address: string,
    userOp: EthUserOperation,
  ): Promise<string | undefined> {
    const wallet = this.#getWalletByAddress(address);
    const decryptedPrivateKey = await decrypt(wallet.encryptedPrivateKey);
    const secureKey = new SecurePrivateKey(decryptedPrivateKey);

    const { chainId } = await provider.getNetwork();
    const entryPoint = await this.#getEntryPoint(
      Number(chainId),
      new ethers.Wallet(decryptedPrivateKey),
    );

    // Sign the userOp
    userOp.signature = '0x';
    const userOpHash = getUserOperationHash(
      userOp,
      await entryPoint.getAddress(),
      chainId.toString(10),
    );

    const signature = await secureKey.sign(ethers.getBytes(userOpHash));
    secureKey.destroy();

    return signature;
  }

  /**
   * Draft method
   * --
   * The transaction submitted to MM Flask via prepareUserOperation and patchUserOperation contains
   * a paymasterAndData field which likely leads to a AA23 error. If userOP is sent by the snap,
   * it succeeds internally, but the Metamask Flask UI labels it as Failed - as it most likely tries to
   * send it itself, which does not succeed due to AA23 and the way things are build on the MM side.
   * @param address
   * @param userOp
   * @param chainId
   * @param signer
   */
  // async #signAndSendUserOperationV07(
  //   address: string,
  //   userOp: EthUserOperation,
  // ): Promise<string | undefined> {
  //   const wallet = this.#getWalletByAddress(address);
  //   const decryptedPrivateKey = await decrypt(wallet.encryptedPrivateKey);
  //   const secureKey = new SecurePrivateKey(decryptedPrivateKey);
  //   const EP = await entryPoint.getAddress();
  //   const { chainId } = await provider.getNetwork();
  //   const entryPoint = await this.#getEntryPoint(
  //     Number(chainId),
  //     new ethers.Wallet(decryptedPrivateKey),
  //   );
  //
  //   userOp.signature = '0x';
  //   delete userOp.paymasterAndData;
  //
  //   console.log('Hashing UserOperation: ', JSON.stringify(userOp));
  //
  //   const userOpHash = getUserOperationHash(userOp, EP, chainId.toString(10));
  //   const signature = await secureKey.sign(ethers.getBytes(userOpHash));
  //   secureKey.destroy();
  //   console.log('UserOp:', userOp);
  //   console.log('EntryPoint:', EP);
  //   console.log('Generated signature:', signature);

  // const res = await this.#sendUserOperation(
  //   {
  //     ...userOp,
  //     signature,
  //   },
  //   EP,
  //   'https://bundler-hc.sepolia.boba.network',
  // );
  // console.log('Broadcasted UP --> ', res);

  // return signature;
  // }

  async #getAAFactory(chainId: number, signer: ethers.Wallet) {
    if (!this.#isSupportedChain(chainId)) {
      throwError(`[Snap] Unsupported chain ID: ${chainId}`);
    }
    let factoryAddress: string;
    const chainConfig = this.#getChainConfig(chainId);
    if (chainConfig?.simpleAccountFactory) {
      factoryAddress = chainConfig.simpleAccountFactory;
    } else {
      throwError(`[Snap] Unknown AA Factory address for chain ${chainId}`);
    }
    return SimpleAccountFactory__factory.connect(factoryAddress, signer);
  }

  async #getEntryPoint(chainId: number, signer: ethers.Wallet) {
    if (!this.#isSupportedChain(chainId)) {
      throwError(`[Snap] Unsupported chain ID: ${chainId}`);
    }
    const entryPointAddress =
      this.#getChainConfig(chainId)?.entryPoint ??
      throwError(`[Snap] Unknown EntryPoint for chain ${chainId}`);

    return EntryPoint__factory.connect(entryPointAddress, signer);
  }

  #getChainConfig(chainId: number): ChainConfig | undefined {
    return AA_CONFIG[chainId];
  }

  #isSupportedChain(chainId: number): boolean {
    return Object.values(CHAIN_IDS).includes(chainId);
  }

  #doesAccountSupportChain(accountId: string, scope: string): boolean {
    const wallet = this.#getWalletById(accountId);
    return Object.prototype.hasOwnProperty.call(wallet.chains, scope);
  }

  async #saveState(): Promise<void> {
    await saveState(this.#state);
  }

  async #emitEvent(
    event: KeyringEvent,
    data: Record<string, Json>,
  ): Promise<void> {
    await emitSnapKeyringEvent(snap, event, data);
  }
}
