import { Context } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '@/enums/itemLayoutMode';

import {
  GRAASP_ANALYZER_HOST,
  GRAASP_LIBRARY_HOST,
  GRAASP_PLAYER_HOST,
} from './env';
import { buildItemPath } from './paths';

export const buildGraaspPlayerView = (id: string): string =>
  `${GRAASP_PLAYER_HOST}/${id}`;
export const buildGraaspBuilderView = (
  id: string,
  mode = DEFAULT_ITEM_LAYOUT_MODE,
): string => {
  const url = new URL(buildItemPath(id), window.location.origin);
  url.searchParams.set('mode', mode);
  return url.toString();
};
export const buildGraaspAnalyzerLink = (id: string): string =>
  `${GRAASP_ANALYZER_HOST}/embedded/${id}`;

export const HOST_MAP = {
  [Context.Builder]: '/',
  [Context.Library]: GRAASP_LIBRARY_HOST,
  [Context.Player]: GRAASP_PLAYER_HOST,
  [Context.Analytics]: GRAASP_ANALYZER_HOST,
};
