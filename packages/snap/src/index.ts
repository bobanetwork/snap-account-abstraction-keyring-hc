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
import { InternalMethod, getOriginPermissions } from './permissions';
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

async function hasPermission(origin: string, method: string): Promise<boolean> {
  let baseUrl: string = origin;
  try {
    const { protocol, hostname } = new URL(origin);
    baseUrl = `${protocol}//${hostname}`;
  } catch {
    console.warn('[Snap] Could not extract baseUrl from ', origin);
  }
  const permissions = await getOriginPermissions();
  return permissions.get(baseUrl)?.includes(method) ?? false;
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  logger.debug(
    `RPC request (origin="${origin}"):`,
    JSON.stringify(request, undefined, 2),
  );

  if (!(await hasPermission(origin, request.method))) {
    throw new Error(
      `Origin '${origin}' is not allowed to call '${request.method}'`,
    );
  }

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
export const onKeyringRequest: OnKeyringRequestHandler = async ({
  origin,
  request,
}) => {
  logger.debug(
    `Keyring request (origin="${origin}"):`,
    JSON.stringify(request, undefined, 2),
  );

  if (!(await hasPermission(origin, request.method))) {
    throw new Error(
      `Origin '${origin}' is not allowed to call '${request.method}'`,
    );
  }

  return (await handleKeyringRequest(await getKeyring(), request)) ?? null;
};
