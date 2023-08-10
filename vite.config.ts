/// <reference types="./src/env.d.ts"/>
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption, UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
const config = ({ mode }: { mode: string }): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: '/',
    server: {
      port: parseInt(process.env.VITE_PORT || '3001', 10),
      // only auto open the app when in dev mode
      open: mode === 'dev',
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
      checker({
        typescript: true,
        eslint: { lintCommand: 'eslint "./**/*.{ts,tsx}"' },
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
      ...(mode === 'development'
        ? [
            visualizer({
              template: 'treemap', // or sunburst
              open: true,
              gzipSize: true,
              brotliSize: true,
              filename: 'bundle_analysis.html',
            }) as PluginOption,
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.REACT_APP_GRAASP_ASSETS_URL': `"${process.env.VITE_GRAASP_ASSETS_URL}"`,
    },
  });
};
export default config;
