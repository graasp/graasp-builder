// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

import initConfig from './cypress/plugins';

export default defineConfig({
  video: false,
  retries: {
    runMode: 2,
  },
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return initConfig(on, config);
    },
    baseUrl: 'http://localhost:3111',
  },
});
