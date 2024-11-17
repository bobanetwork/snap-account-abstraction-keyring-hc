import {
  MethodNotSupportedError,
  handleKeyringRequest,
} from '@metamask/keyring-api';
import type {
  OnKeyringRequestHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';

import { AccountAbstractionKeyring } from './keyring';
import { logger } from './logger';
import { InternalMethod } from './permissions';
import { getState } from './stateManagement';

let keyring: AccountAbstractionKeyring;

async function getKeyring(): Promise<AccountAbstractionKeyring> {
  if (!keyring) {
    const state = await getState();
    if (state) {
      // eslint-disable-next-line require-atomic-updates
      keyring = new AccountAbstractionKeyring(state);
    }
  }
  return keyring;
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  logger.debug(
    `RPC request (origin="${origin}"):`,
    JSON.stringify(request, undefined, 2),
  );

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

  // Handle keyring methods.
  return handleKeyringRequest(await getKeyring(), request);
};
