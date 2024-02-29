import { LIBRARY_ITEMS_PREFIX, buildSignInPath } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

const GRAASP_PLAYER_HOST = Cypress.env('VITE_GRAASP_PLAYER_HOST');
const GRAASP_BUILDER_HOST = Cypress.config('baseUrl');
const GRAASP_ANALYZER_HOST = Cypress.env('VITE_GRAASP_ANALYZER_HOST');
const GRAASP_LIBRARY_HOST = Cypress.env('VITE_GRAASP_LIBRARY_HOST');
export const GRAASP_REDIRECTION_HOST = Cypress.env(
  'VITE_GRAASP_REDIRECTION_HOST',
);

export const SIGN_IN_PATH = buildSignInPath({
  host: Cypress.env('VITE_GRAASP_AUTH_HOST'),
});

export const buildGraaspPlayerView = (id: string): string =>
  `${GRAASP_PLAYER_HOST}/${id}`;
export const buildGraaspBuilderView = (id: string): string =>
  `${GRAASP_BUILDER_HOST}${buildItemPath(id)}`;
export const buildGraaspAnalyzerLink = (id: string): string =>
  `${GRAASP_ANALYZER_HOST}/embedded/${id}`;
export const buildGraaspLibraryLink = (id: string): string =>
  `${GRAASP_LIBRARY_HOST}${LIBRARY_ITEMS_PREFIX}/${id}`;
