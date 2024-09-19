import {
  EthBaseTransaction,
  MethodNotSupportedError,
  handleKeyringRequest, KeyringRequest
} from "@metamask/keyring-api";
import type {
  OnKeyringRequestHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';
import { z } from 'zod';

import { AccountAbstractionKeyring } from './keyring';
import { logger } from './logger';
import { InternalMethod, originPermissions } from './permissions';
import { getState } from './stateManagement';

let keyring: AccountAbstractionKeyring;
let keyringPromise: Promise<AccountAbstractionKeyring> | null = null;

async function getKeyring(): Promise<AccountAbstractionKeyring> {
  if (!keyring) {
    const state = await getState();
    keyring = new AccountAbstractionKeyring(state);
  }
  return keyring;
}

/**
 * Verify if the caller can call the requested method.
 *
 * @param origin - Caller origin.
 * @param method - Method being called.
 * @returns True if the caller is allowed to call the method, false otherwise.
 */
function hasPermission(origin: string, method: string): boolean {
  let baseUrl: string = origin;
  try {
    const { protocol, hostname, port } = new URL(origin);

    // Normalize hostname and include port
    const normalizedHostname = hostname.toLowerCase();
    baseUrl = port
      ? `${protocol}//${normalizedHostname}:${port}`
      : `${protocol}//${normalizedHostname}`;
  } catch {
    console.warn('[Snap] Could not extract baseUrl from ', origin);
  }
  return originPermissions.get(baseUrl)?.includes(method) ?? false;
}

// Define a schema for the RPC request object
const rpcRequestSchema = z.object({
  origin: z.string().url(),
  request: z.object({
    id: z.string(),
    method: z.string(),
    params: z.record(z.unknown()), // Allow any key-value pairs, but ensure it's an object
  }),
});

type ValidatedRpcRequest = z.infer<typeof rpcRequestSchema>;

function sanitizeParams(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replace(/[<>]/g, '') : value
    ])
  );
}


export const onRpcRequest: OnRpcRequestHandler = async (rpcRequest) => {
  try {
    const { origin, request } = rpcRequestSchema.parse(rpcRequest);

    logger.debug(`RPC request (origin="${origin}", method="${request.method}")`);

    if (!hasPermission(origin, request.method)) {
      throw new Error(`Origin '${origin}' is not allowed to call '${request.method}'`);
    }

    const sanitizedParams = sanitizeParams(request.params);

    // Handle custom methods.
    switch (request.method) {
      case InternalMethod.SendUserOpBoba:
      case InternalMethod.SendUserOpBobaPM: {
        const keyring = await getKeyring();
        return keyring.submitRequest({
          id: request.id,
          request: {
            method: request.method,
            params: sanitizedParams,
          },
        } as KeyringRequest);
      }
      default: {
        throw new MethodNotSupportedError(request.method);
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Invalid RPC request:', error.errors);
      throw new Error('Invalid RPC request format');
    }
    throw error;
  }
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TODO: fix types
export const onKeyringRequest: OnKeyringRequestHandler = async ({
  origin,
  request,
}) => {
  logger.debug(
    `Keyring request (origin="${origin}"):`,
    JSON.stringify(request, undefined, 2),
  );

  // Check if origin is allowed to call method.
  if (!hasPermission(origin, request.method)) {
    throw new Error(
      `Origin '${origin}' is not allowed to call '${request.method}'`,
    );
  }

  // Handle keyring methods.
  return handleKeyringRequest(await getKeyring(), request);
};
