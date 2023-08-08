import { buildSignInPath } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

const GRAASP_PLAYER_HOST = Cypress.env('PLAYER_HOST');
const GRAASP_ANALYZER_HOST = Cypress.env('ANALYZER_HOST');

export const SIGN_IN_PATH = buildSignInPath({ host: Cypress.env('AUTH_HOST') });

export const buildGraaspPlayerView = (id: string): string =>
  `${GRAASP_PLAYER_HOST}/${id}`;
export const buildGraaspBuilderView = (id: string): string =>
  `${window.location.origin}${buildItemPath(id)}`;
export const buildGraaspAnalyzerLink = (id: string): string =>
  `${GRAASP_ANALYZER_HOST}/embedded/${id}`;
