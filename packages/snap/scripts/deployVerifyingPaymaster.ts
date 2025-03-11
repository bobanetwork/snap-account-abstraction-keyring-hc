/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import { ethers } from 'hardhat';

import { VerifyingPaymaster__factory } from '../src/types';
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';

/**
 * Main function for deploying the contract.
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  const VerifyingPaymasterFactory = new VerifyingPaymaster__factory(deployer!);

  await VerifyingPaymasterFactory.deploy(
    // use local entrypoint when deployed (assuming network local), otherwise sepolia
    process.env.LOCAL_ENTRYPOINT ??
      '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
    deployer!.address,
  );
}

main().catch(() => {
  process.exitCode = 1;
});
