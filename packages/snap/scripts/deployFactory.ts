/* eslint-disable camelcase */
import { ethers } from 'hardhat';
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';

import { SimpleAccountFactory__factory } from '../src/types';

/**
 * Main function for deploying the contract.
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const SimpleAccountFactory = new SimpleAccountFactory__factory(deployer!);

  await SimpleAccountFactory.deploy(
    // use local entrypoint when deployed (assuming network local), otherwise sepolia
    process.env.LOCAL_ENTRYPOINT ??
      '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
