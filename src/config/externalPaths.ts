import { Context, buildSignInPath } from '@graasp/sdk';

import {
  GRAASP_ANALYZER_HOST,
  GRAASP_AUTH_HOST,
  GRAASP_LIBRARY_HOST,
  GRAASP_PLAYER_HOST,
} from './env';
import { buildItemPath } from './paths';

export const buildGraaspPlayerView = (id: string): string =>
  `${GRAASP_PLAYER_HOST}/${id}`;
export const buildGraaspBuilderView = (id: string): string =>
  `${window.location.origin}${buildItemPath(id)}`;
export const buildGraaspAnalyzerLink = (id: string): string =>
  `${GRAASP_ANALYZER_HOST}/embedded/${id}`;

// signin page path from auth host
export const SIGN_IN_PATH = buildSignInPath({ host: GRAASP_AUTH_HOST });

export const HOST_MAP = {
  [Context.Builder]: '/',
  [Context.Library]: GRAASP_LIBRARY_HOST,
  [Context.Player]: GRAASP_PLAYER_HOST,
  [Context.Analytics]: GRAASP_ANALYZER_HOST,
};
