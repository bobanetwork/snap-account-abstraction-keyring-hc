# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.4]
### Uncategorized
- feat: Add userOpHash to dialog
- fix: isLocal env
- feat: Add local network switch support, conditional
- feat: Add local network switch support, conditional
- fix-env
- fix: Docker host fixed
- fix: versions
- chore: lint
- fix if chain not found
- revert the env params.
- fix boba sepolia network check and show alert
- change: convert to stringified number
- updated snaps in env file and prepare hc specific files.
- change: - reload and set current account on switching. - fix and load the env variable for snap origin - update env
- change: - force user to connect to boba sepolia - updated selected account with id instead of address. - fix amount parseing correctly with parseunits and tokenList
- change: remove delete condition.
- Merge branch 'main' of github.com-enya:bobanetwork/snap-account-abstraction-keyring into fixes/aa-hc-web-interface
- change: force user to connect to sepolia network
- change: remove delete btn for selected account in MM flask
- change: switch app on changing account in MM and also set mm account as current one!!
- change: disable the button on create account!
- add det_pk option for SA creation
- change: covert amount to wei string
- changes updated the web view considering the hc-wallet
- udpate config and permissions
- add paymaster setup and auto detection
- update SimpleAccountFactory addr
- add paymaster setup methods
- add bundler sepolia
- fix: erc20 transfer
- rem unused methods and cleanup
- fix: - updated permission & config - function to trigger on sendBobaPM - check for paymaster - updated message in snap dialog.
- dialog with data to sign
- partial
- trial error fixes
- fix: added greet as separate function!
- enable ui to submit transfer / debugging invoke feature of keyring client.
- add new methods to snap
- fix: Chain config setup ([#62](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/62))
- test: increase test coverage ([#51](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/51))
- Feat: remove pending requests and associated methods ([#45](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/45))
- 0.2.2 ([#48](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/48))
- 0.2.1 ([#41](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/41))
- Revert "0.2.1 (#36)" ([#36](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/36))
- 0.2.1 ([#36](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/36))
- Fix/private-site ([#35](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/35))
- Revert "0.2.1 (#33)" ([#33](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/33))
- 0.2.1 ([#33](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/33))
- fix: autochangelog ([#30](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/30))
- Revert "0.2.1 (#28)" ([#28](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/28))
- 0.2.1 ([#28](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/28))
- 0.2.0 ([#24](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/24))
- chore: add changelog category ([#23](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/23))
- fix: downgrade version to retrigger publish ([#21](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/21))
- 0.2.0 ([#19](https://github.com/bobanetwork/snap-account-abstraction-keyring/pull/19))
- fix: changelogs
- bump: metamask/providers
- fix: remove unused variables
- Removed userOp methods from front-end
- Added validation to setting the config
- Added ability to set chain configuration via keyring and UI
- Added salt ability to front end create account
- Updated snap name on front end
- updated front end to import private key in create account and include userOp methods
- fix: update keyring api on site
- feat: inital aa snap commit

## [0.2.2]
### Changed
- Bump keyring-api in site package to (latest) 3.0.0 ([#47](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/47))
- Update snap origin ([#44](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/44))

## [0.2.1]

## [0.2.0]
### Changed
- Fix updates configs to match template ([#14](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/14))
- Fix chain config for the companion dapp ([#8](https://github.com/MetaMask/snap-account-abstraction-keyring/pull/8))

## [0.1.0] - 2024-01-15
### Added
- Initial release.

[Unreleased]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v1.1.4...HEAD
[1.1.4]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.2.2...v1.1.4
[0.2.2]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/bobanetwork/snap-account-abstraction-keyring/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/bobanetwork/snap-account-abstraction-keyring/releases/tag/v0.1.0
