# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.5]

### Uncategorized

- fix: SAY-01: mitigate wrong counter by incrementing on account creation
- fix: dead code
- fix: rm dead code
- fix: rm permission check
- fix: SAY-02: pinned dependencies
- Update packages/snap/src/index.ts
- fix: reset validation; running state
- fix: reset port setting
- fix: encryption storage state
- fix: 17 - Remove Global keyring Variable
- fix: 16 - Port Number Ignored in hasPermission
- fix: 14,15 - Delete Comment, Fetchind and Handling External Resources
- fix: 12 - User Consent, Phishing Risks
- fix: 11 - Input Validation
- fix: 10 - Handle of Private Keys
- fix: 9 - No Feedback on saveState
- fix: 8 - Lack of Error Handling
- fix: 7 - Remove Logging of Sensitive State Data
- fix: 6 - Resolve TODO Comments
- fix: 5 - Race Condition in getKeyring
- fix: 4 - Input Validation for Requests
- fix: 3 - Remove as any
- fix: 2 - Sensitive Logging
- fix: 1 - Origin Parsing
- prepare and build snap for hc with support for wallet url
- fix: aa-config
- 1.1.4
- fix: forked release workflows
- fix: Gas estimation, etc.
- debuggging
- feat: Add userOpHash to dialog
- cleanup
- fix-env
- rm-dotenv
- env
- feat: Add local support for deploy scripts
- snap-local
- fix: Docker host fixed
- fix: versions
- chore: lint
- feat: fixed some typings, allow users to override some userOp params
- update snap version and hash
- style fixes
- update package v
- add det_pk option for SA creation
- change reverted snap change!
- changes updated the web view considering the hc-wallet
- udpate config and permissions
- add more preVerifGas for sepolia bundler
- add paymaster setup and auto detection
- support boba sepolia
- update SimpleAccountFactory addr
- add paymaster setup methods
- add bundler sepolia
- fix: erc20 transfer
- update validation method
- update snap hash
- add constant aa config
- rem unused methods and cleanup
- fix: - updated permission & config - function to trigger on sendBobaPM - check for paymaster - updated message in snap dialog.
- add snap_dialog with alert and snap_notify
- dialog with data to sign
- partial
- trial error fixes
- fix: added greet as separate function!
- enable ui to submit transfer / debugging invoke feature of keyring client.
- add paymaster
- add new methods to snap
- fix: changelogs
- fix: lint in template string
- fix: remove unneeded deps
- fix: lint
- fix: lint
- fix: remove prettier for cache, coverage and artifacts
- chore: fix lint
- fix: dynamically set networks based on env
- fix: remove @uniswap/sdk-core
- fix: update env files for snap
- fix: lint
- fix: verifying paymaster test
- fix: tests
- Removed userOp methods from front-end
- Added validation to setting the config
- Updated TODOs for validation and setting if an account is deployed
- Fix: do not destructure transaction array in prepareUserOp
- Fix: return '0x' for dummy paymaster and data
- Fix: updated chainIdDecimal to base 10
- Fix: wrap user op hash in bytes before signing
- Added ability to set chain configuration via keyring and UI
- Added salt ability to front end create account
- fix: remove usage of jest env
- Added compile step to build
- fix: patchUserOperation to use verifying paymaster
- chore: update readme
- fix: sign userOperation
- feat: update hardhat config with chainId and max accounts
- updated front end to import private key in create account and include userOp methods
- fix: change salt to be dynamic
- fix: update keyring api on site
- fix: SimpleAccountFactory getAddress to getAccountAddress
- fix: return types for prepareUserOperation
- fix: add network-access permission
- feat: impl patchUserOperation
- Added salt to wallet state and address for paymaster to env.sample
- Updated paymaster url in env.sample
- Updated dummy values and added urls to env.sample
- Updated implementation for preparing and signing requests and merged with deploy contracts branch
- Merge remote-tracking branch 'origin/feat/deploy-factories' into feat/implement-4337-methods
- Finished implementing prepareUserOp
- feat: add deployment script for factories
- feat: add env sample and update hardhat config
- feat: add jest
- Started implementing method to prepare userOp
- Added method stubs for user operations
- Init: removed async methods and flows
- Removed unnecessary error throw and set deployed to false in createAccount
- Added initCode generation to createAccount
- Added sign transaction to unsupported methods
- Added ethers@5.7.0 to dependencies
- feat: init commit with createAccount and state updates
- feat: update readme and gitignore
- feat: add v0.6.0 reference contracts
- feat: add hardhat and openzeppelin
- feat: inital aa snap commit

## [1.1.4]

### Uncategorized

- fix: forked release workflows
- fix: Gas estimation, etc.
- debuggging
- feat: Add userOpHash to dialog
- cleanup
- fix-env
- rm-dotenv
- env
- feat: Add local support for deploy scripts
- snap-local
- fix: Docker host fixed
- fix: versions
- chore: lint
- feat: fixed some typings, allow users to override some userOp params
- update snap version and hash
- style fixes
- update package v
- add det_pk option for SA creation
- change reverted snap change!
- changes updated the web view considering the hc-wallet
- udpate config and permissions
- add more preVerifGas for sepolia bundler
- add paymaster setup and auto detection
- support boba sepolia
- update SimpleAccountFactory addr
- add paymaster setup methods
- add bundler sepolia
- fix: erc20 transfer
- update validation method
- update snap hash
- add constant aa config
- rem unused methods and cleanup
- fix: - updated permission & config - function to trigger on sendBobaPM - check for paymaster - updated message in snap dialog.
- add snap_dialog with alert and snap_notify
- dialog with data to sign
- partial
- trial error fixes
- fix: added greet as separate function!
- enable ui to submit transfer / debugging invoke feature of keyring client.
- add paymaster
- add new methods to snap
- fix: Chain config setup ([#62](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/62))
- test: increase test coverage ([#51](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/51))
- Feat: remove pending requests and associated methods ([#45](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/45))
- test: refactor chain configuration unit test ([#49](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/49))
- 0.2.2 ([#48](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/48))
- Bump keyring-api in site package to (latest) 3.0.0 ([#47](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/47))
- 0.2.1 ([#41](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/41))
- fix: update package names ([#40](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/40))
- Revert "0.2.1 (#36)" ([#36](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/36))
- 0.2.1 ([#36](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/36))
- Revert "0.2.1 (#33)" ([#33](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/33))
- 0.2.1 ([#33](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/33))
- fix: autochangelog ([#30](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/30))
- Revert "0.2.1 (#28)" ([#28](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/28))
- 0.2.1 ([#28](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/28))
- 0.2.0 ([#24](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/24))
- chore: add changelog category ([#23](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/23))
- fix: downgrade version to retrigger publish ([#21](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/21))
- 0.2.0 ([#19](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/19))
- Use snap template workflows ([#17](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/17))
- Fix updates configs to match template ([#14](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/14))
- fix: changelogs
- fix: lint in template string
- fix: remove unneeded deps
- fix: lint
- fix: lint
- fix: remove prettier for cache, coverage and artifacts
- chore: fix lint
- fix: dynamically set networks based on env
- fix: remove @uniswap/sdk-core
- fix: update env files for snap
- fix: lint
- fix: verifying paymaster test
- fix: tests
- Removed userOp methods from front-end
- Added validation to setting the config
- Updated TODOs for validation and setting if an account is deployed
- Fix: do not destructure transaction array in prepareUserOp
- Fix: return '0x' for dummy paymaster and data
- Fix: updated chainIdDecimal to base 10
- Fix: wrap user op hash in bytes before signing
- Added ability to set chain configuration via keyring and UI
- Added salt ability to front end create account
- fix: remove usage of jest env
- Added compile step to build
- fix: patchUserOperation to use verifying paymaster
- chore: update readme
- fix: sign userOperation
- feat: update hardhat config with chainId and max accounts
- updated front end to import private key in create account and include userOp methods
- fix: change salt to be dynamic
- fix: update keyring api on site
- fix: SimpleAccountFactory getAddress to getAccountAddress
- fix: return types for prepareUserOperation
- fix: add network-access permission
- feat: impl patchUserOperation
- Added salt to wallet state and address for paymaster to env.sample
- Updated paymaster url in env.sample
- Updated dummy values and added urls to env.sample
- Updated implementation for preparing and signing requests and merged with deploy contracts branch
- Merge remote-tracking branch 'origin/feat/deploy-factories' into feat/implement-4337-methods
- Finished implementing prepareUserOp
- feat: add deployment script for factories
- feat: add env sample and update hardhat config
- feat: add jest
- Started implementing method to prepare userOp
- Added method stubs for user operations
- Init: removed async methods and flows
- Removed unnecessary error throw and set deployed to false in createAccount
- Added initCode generation to createAccount
- Added sign transaction to unsupported methods
- Added ethers@5.7.0 to dependencies
- feat: init commit with createAccount and state updates
- feat: update readme and gitignore
- feat: add v0.6.0 reference contracts
- feat: add hardhat and openzeppelin
- feat: inital aa snap commit

## [0.2.2]

### Changed

- Update chain config validation logic ([#20](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/20))
- Bump @metamask/snaps-sdk from 2.0.0 to 2.1.0 ([#37](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/37))

## [0.2.1]

### Changed

- Bump keyring-api dependency ([#26](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/26))

## [0.2.0]

### Added

- Add userop methods and updates account creation ([#4](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/4))
- Add contract addresses and deployment script ([#2](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/2))

### Changed

- Fix regex to support query parameters ([#13](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/13))
- Fix initcode generation ([#8](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/8))

## [0.1.0] - 2024-01-15

### Added

- Initial release.

[Unreleased]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v1.1.5...HEAD
[1.1.5]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.2.2...v1.1.4
[0.2.2]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/bobanetwork/snap-account-abstraction-keyring/releases/tag/v0.1.0
