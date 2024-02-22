const {
  VITE_VERSION,
  VITE_GRAASP_API_HOST,
  VITE_GRAASP_DOMAIN,
  VITE_GRAASP_ACCOUNT_HOST,
  VITE_GRAASP_ANALYZER_HOST,
  VITE_GRAASP_LIBRARY_HOST,
  VITE_GRAASP_PLAYER_HOST,
  VITE_GRAASP_AUTH_HOST,
  VITE_SHOW_NOTIFICATIONS,
  VITE_GRAASP_ASSETS_URL,
  VITE_H5P_INTEGRATION_URL,
  VITE_SENTRY_ENV,
  VITE_GA_MEASUREMENT_ID,
  VITE_SENTRY_DSN,
} =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.Cypress ? Cypress.env() : import.meta.env;

export const APP_VERSION = VITE_VERSION;
export const DOMAIN = VITE_GRAASP_DOMAIN;

export const API_HOST = VITE_GRAASP_API_HOST || 'http://localhost:3000';

export const GRAASP_AUTH_HOST =
  VITE_GRAASP_AUTH_HOST || 'http://localhost:3001';
export const GRAASP_PLAYER_HOST =
  VITE_GRAASP_PLAYER_HOST || 'http://localhost:3112';
export const GRAASP_LIBRARY_HOST =
  VITE_GRAASP_LIBRARY_HOST || 'http://localhost:3115';
export const GRAASP_ANALYZER_HOST =
  VITE_GRAASP_ANALYZER_HOST || 'http://localhost:3113';
export const GRAASP_ACCOUNT_HOST =
  VITE_GRAASP_ACCOUNT_HOST || 'http://localhost:3114';

export const GRAASP_REDIRECTION_HOST = import.meta.env
  .VITE_GRAASP_REDIRECTION_HOST;

export const H5P_INTEGRATION_URL =
  VITE_H5P_INTEGRATION_URL || `${API_HOST}/p/h5p-integration`;
export const GRAASP_ASSETS_URL = VITE_GRAASP_ASSETS_URL;

export const SENTRY_ENV = VITE_SENTRY_ENV;
export const SENTRY_DSN = VITE_SENTRY_DSN;
export const GA_MEASUREMENT_ID = VITE_GA_MEASUREMENT_ID;

export const SHOW_NOTIFICATIONS = VITE_SHOW_NOTIFICATIONS === 'true' || false;
