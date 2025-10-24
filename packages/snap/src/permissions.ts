export enum InternalMethod {
  ToggleSyncApprovals = 'snap.internal.toggleSynchronousApprovals',
  IsSynchronousMode = 'snap.internal.isSynchronousMode',
  SendUserOpBoba = 'eth_sendUserOpBoba',
  SendUserOpBobaPM = 'eth_sendUserOpBobaPM',
}

const PERMISSIONS_URL =
  'https://raw.githubusercontent.com/bobanetwork/snap-account-abstraction-keyring-hc/refs/heads/main/permissions.json';

const defaultPermissions = new Map<string, string[]>([]);

let cachedPermissions: Map<string, string[]> | null = null;
let lastFetchTime = 0;
let fetchPromise: Promise<Map<string, string[]>> | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getOriginPermissions(): Promise<Map<string, string[]>> {
  const now = Date.now();

  if (cachedPermissions && now - lastFetchTime < CACHE_DURATION) {
    return cachedPermissions;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await fetch(PERMISSIONS_URL);
      const data = (await response.json()) as Record<string, string[]>;
      const permissions = new Map(Object.entries(data));
      cachedPermissions = permissions;
      lastFetchTime = Date.now();
      return permissions;
    } catch (error) {
      console.error(
        '[Snap] Error fetching permissions, using defaults:',
        error,
      );
      cachedPermissions = defaultPermissions;
      lastFetchTime = Date.now();
      return defaultPermissions;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}
