import setupCoverage from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

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
      setupCoverage(on, config);
      on('file:preprocessor', vitePreprocessor());
      return config;
    },
    baseUrl: `http://localhost:${process.env.VITE_PORT || 3333}`,
  },
});
