import {
  MethodNotSupportedError,
  handleKeyringRequest,
} from '@metamask/keyring-snap-sdk';
import type {
  OnKeyringRequestHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';

import { AccountAbstractionKeyring } from './keyring';
import { logger } from './logger';
import { InternalMethod, originPermissions } from './permissions';
import { getState } from './stateManagement';

let keyring: AccountAbstractionKeyring;

async function getKeyring(): Promise<AccountAbstractionKeyring> {
  if (!keyring) {
    const state = await getState();
    if (!keyring) {
      keyring = new AccountAbstractionKeyring(state);
    }
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
    const { protocol, hostname } = new URL(origin);
    baseUrl = `${protocol}//${hostname}`;
  } catch {
    console.warn('[Snap] Could not extract baseUrl from ', origin);
  }
  return originPermissions.get(baseUrl)?.includes(method) ?? false;
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  logger.debug(
    `RPC request (origin="${origin}"):`,
    JSON.stringify(request, undefined, 2),
  );

  // Check if origin is allowed to call method.
  if (!hasPermission(origin, request.method)) {
    throw new Error(
      `Origin '${origin}' is not allowed to call '${request.method}'`,
    );
  }

  // Handle custom methods.
  switch (request.method) {
    case InternalMethod.SendUserOpBoba:
    case InternalMethod.SendUserOpBobaPM: {
      const { id, method, params } = request;
      return (await getKeyring()).submitRequest({
        id,
        request: {
          method,
          params,
        },
      } as any);
    }

    default: {
      throw new MethodNotSupportedError(request.method);
    }
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
  // return handleKeyringRequest(await getKeyring(), request);
  // eslint-disable-next-line
  // @ts-ignore TODO: fix typeings
  return (await handleKeyringRequest(await getKeyring(), request)) ?? null;
};
