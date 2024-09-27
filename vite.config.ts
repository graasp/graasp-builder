/// <reference types="./src/env.d.ts"/>
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
const config = ({ mode }: { mode: string }): UserConfigExport => {
  process.env = {
    VITE_VERSION: 'default',
    VITE_BUILD_TIMESTAMP: new Date().toISOString(),
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  return defineConfig({
    base: '/',
    server: {
      port: parseInt(process.env.VITE_PORT || '3111', 10),
      // only auto open the app when in dev mode
      open: mode === 'development',
      watch: {
        ignored: ['**/coverage/**', '**/cypress/downloads/**'],
      },
    },
    preview: {
      port: parseInt(process.env.VITE_PORT || '3333', 10),
      strictPort: true,
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      mode === 'test'
        ? undefined
        : checker({
            typescript: true,
            eslint: { lintCommand: 'eslint "./**/*.{ts,tsx}"' },
            overlay: { initialIsOpen: false },
          }),
      react(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test/', '.nyc_output', 'coverage'],
        extension: ['.js', '.ts', '.tsx'],
        requireEnv: false,
        forceBuildInstrument: mode === 'test',
        checkProd: true,
      }),
    ],
    optimizeDeps: {
      include: [
        // Solves "Uncaught TypeError: styled_default is not a function"
        // This issue seems to be introduced in Graasp Builder 2.39.0
        '@mui/material/Tooltip',
      ],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });
};
export default config;
