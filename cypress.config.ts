import setupCoverage from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  retries: {
    runMode: 2,
  },
  chromeWebSecurity: false,
  e2e: {
    env: {
      VITE_GRAASP_REDIRECTION_HOST: process.env.VITE_GRAASP_REDIRECTION_HOST,
      VITE_GRAASP_DOMAIN: process.env.VITE_GRAASP_DOMAIN,
      VITE_GRAASP_API_HOST: process.env.VITE_GRAASP_API_HOST,
      VITE_SHOW_NOTIFICATIONS: false,
      VITE_GRAASP_AUTH_HOST: process.env.VITE_GRAASP_AUTH_HOST,
      VITE_GRAASP_PLAYER_HOST: process.env.VITE_GRAASP_PLAYER_HOST,
      VITE_GRAASP_ANALYZER_HOST: process.env.VITE_GRAASP_ANALYZER_HOST,
      VITE_GRAASP_LIBRARY_HOST: process.env.VITE_GRAASP_LIBRARY_HOST,
      VITE_GRAASP_ACCOUNT_HOST: process.env.VITE_GRAASP_ACCOUNT_HOST,
    },
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      setupCoverage(on, config);
      return config;
    },
    baseUrl: `http://localhost:${process.env.VITE_PORT || 3333}`,
  },
});
