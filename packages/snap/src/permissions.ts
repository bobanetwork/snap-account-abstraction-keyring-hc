import { KeyringRpcMethod } from "@metamask/keyring-api";

export enum InternalMethod {
  ToggleSyncApprovals = "snap.internal.toggleSynchronousApprovals",
  IsSynchronousMode = "snap.internal.isSynchronousMode",
  SendUserOpBoba = "eth_sendUserOpBoba",
  SendUserOpBobaPM = "eth_sendUserOpBobaPM",
}
