import type { SnapConfig } from '@metamask/snaps-cli';

const config: SnapConfig = {
  bundler: 'webpack',
  input: 'src/index.ts',
  server: { port: 8080 },
  polyfills: {
    buffer: true,
    stream: true,
    crypto: true,
  },
  environment: {
    DAPP_ORIGIN_PRODUCTION: 'https://hub.boba.network/',
    DAPP_ORIGIN_DEVELOPMENT: 'http://0.0.0.0:8000/',
  },
  stats: {
    builtIns: {
      // The following builtins can be ignored. They are used by some of the
      // dependencies, but are not required by this snap.
      ignore: [
        'events',
        'http',
        'https',
        'zlib',
        'util',
        'url',
        'string_decoder',
        'punycode',
      ],
    },
  },
};

export default config;
