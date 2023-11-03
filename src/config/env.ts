export const APP_VERSION = import.meta.env.VITE_VERSION;
export const DOMAIN = import.meta.env.VITE_GRAASP_DOMAIN;

export const API_HOST =
  import.meta.env.VITE_GRAASP_API_HOST || 'http://localhost:3000';

export const GRAASP_AUTH_HOST =
  import.meta.env.VITE_GRAASP_AUTH_HOST || 'http://localhost:3001';
export const GRAASP_PLAYER_HOST =
  import.meta.env.VITE_GRAASP_PLAYER_HOST || 'http://localhost:3112';
export const GRAASP_LIBRARY_HOST =
  import.meta.env.VITE_GRAASP_LIBRARY_HOST || 'http://localhost:3005';
export const GRAASP_ANALYZER_HOST =
  import.meta.env.VITE_GRAASP_ANALYZER_HOST || 'http://localhost:3113';
export const GRAASP_ACCOUNT_HOST =
  import.meta.env.VITE_GRAASP_ACCOUNT_HOST || 'http://localhost:3115';

export const GRAASP_REDIRECTION_HOST = import.meta.env
  .VITE_GRAASP_REDIRECTION_HOST;

export const H5P_INTEGRATION_URL =
  import.meta.env.VITE_H5P_INTEGRATION_URL || `${API_HOST}/p/h5p-integration`;
export const GRAASP_ASSETS_URL = import.meta.env.VITE_GRAASP_ASSETS_URL;

export const SENTRY_ENV = import.meta.env.VITE_SENTRY_ENV;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const SHOW_NOTIFICATIONS =
  import.meta.env.VITE_SHOW_NOTIFICATIONS === 'true' || false;
