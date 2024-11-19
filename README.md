# Simple Account Abstraction Snap

This repository contains the official Account Abstraction - Hybrid Compute snap.

[Hybrid Compute](https://docs.boba.network/hc) utilizes [Account Abstraction](https://docs.boba.network/developer/features/aa-basics) on Boba Network to engage with off-chain APIs seamlessly. This enables you to engage with GenAI or any other off-chain data you can imagine. Leverage Hybrid Compute to increase the power and interoperability of your MetaMask.

Unlock the power of real-world data for Web3 with Hybrid Compute; a single line of code is all it takes.

## Audit
The snap has been audited by Sayfer. You can find the report [here](https://sayfer.io/audits/metamask-snap-audit-report-for-enya-labs/).

## Prerequisites

Snaps is pre-release software. To interact with (your) Snaps, install:
- [MetaMask Flask](https://metamask.io/flask/), a canary distribution for developers that provides access to upcoming features
- `yarn`
- `npm`

## Cloning

Clone the template-snap repository [using this template](https://github.com/MetaMask/template-snap-monorepo/generate) and set up your development environment.

If you clone or create this repository outside the MetaMask GitHub organization, consider running `./scripts/cleanup.sh` to remove some
files that will not work properly outside the MetaMask GitHub organization.

This repository contains GitHub Actions that you may find useful. See `.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing) below for more information.

Note that the `action-publish-release.yml` workflow contains a step that publishes the frontend of this snap (contained in the `public/` directory) to GitHub pages. If you do not want to publish the frontend to GitHub pages, simply remove the step named "Publish to GitHub Pages" in that workflow.

If you don't wish to use any of the existing GitHub actions in this repository, simply delete the `.github/workflows` directory.

## Getting Started

Install the snap:

```shell
cd <name-of-your-repo-root-dir>
yarn install
```

Compile your types:

```shell
cd packages/snap && yarn compile
```

Start the application:

```shell
cd <name-of-your-repo-root-dir>
yarn start
```

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

### Releasing & Publishing

The project follows the same release process as the other libraries in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process; see those repositories for more information about how they work.

1. Choose a release version.

   - The release version should be chosen according to [SemVer](https://semver.org/). Analyze the changes to see whether they include any breaking changes, new features, or deprecations, then choose the appropriate `SemVer` version. See [the SemVer specification](https://semver.org/) for more information.

2. If this release is backporting changes onto a previous release, make sure there is a major version branch for that version (e.g. `1.x` for a `v1` backport release).

   - The major version branch should be set to the most recent release with that major version. For example, when backporting a `v1.0.2` release,
     you'd want to ensure there was a `1.x` branch that was set to the `v1.0.1` tag.

3. Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event
   [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the "Create Release Pull Request" action to create the release PR.

   - For a backport release, the base branch should be the major version branch that you ensured existed in step 2. For a normal release, the base branch should be the main branch for that repository (which should be the default value). This should trigger the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

4. Update the changelog to move each change entry into the appropriate change category (see [here](https://keepachangelog.com/en/1.0.0/#types) for the full list of change categories and the correct ordering). 

   - Generally any changes that don't affect consumers of the package (e.g. lockfile changes or development environment changes) are omitted.
     Exceptions may be made for changes that might be of interest despite not having an effect upon the published package (e.g. major test improvements, security improvements, improved documentation, etc.).

   - Make sure the changelog edits are understandable for package users (e.g. avoid referencing internal variables/concepts).

   - Consolidate related changes into one change entry if it makes it easier to explain.

   - Run `yarn auto-changelog validate --rc` to check that the changelog is correctly formatted.

5. Review and QA the release.

   - If changes are made to the base branch, you will need to update the release branch with these changes and review/QA will need to restart again. As such, it's probably best to avoid merging other PRs into the base branch while review is underway.

6. Squash and merge the release.

   - This should trigger the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to tag the final release commit and publish the release on GitHub.

7. Publish the release on `npm`.

   - Be very careful to use a clean, local environment to publish the release. Follow the exact same steps used during CI.

   - Run `npm publish --dry-run` to examine the release contents to ensure the correct files are included. Compare to previous releases if necessary (e.g. using `https://unpkg.com/browse/[package name]@[package version]/`).

   - Once you are confident the release contents are correct, publish the release by running `npm publish`.

## Notes

- We use [Babel](https://babeljs.io/) for transpiling `TypeScript` to `JavaScript`. Therefore, when building with the CLI, `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
