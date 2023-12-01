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
      API_HOST: process.env.VITE_GRAASP_API_HOST,
      AUTH_HOST: process.env.VITE_GRAASP_AUTH_HOST,
      BUILDER_HOST: `http://localhost:${process.env.VITE_PORT}`,
      PLAYER_HOST: process.env.VITE_GRAASP_PLAYER_HOST,
      ANALYZER_HOST: process.env.VITE_GRAASP_ANALYZER_HOST,
      LIBRARY_HOST: process.env.VITE_GRAASP_LIBRARY_HOST,
      REDIRECTION_HOST: process.env.VITE_GRAASP_REDIRECTION_HOST,
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
