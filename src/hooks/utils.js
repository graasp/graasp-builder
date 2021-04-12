import { List, Map } from 'immutable';
import {
  buildItemChildrenKey,
  buildItemKey,
  buildItemParentsKey,
  OWN_ITEMS_KEY,
  SHARED_ITEMS_KEY,
} from '../config/keys';
import * as Api from '../api';
import {
  STALE_TIME_MILLISECONDS,
  CACHE_TIME_MILLISECONDS,
} from '../config/constants';

const itemQueryConfig = {
  staleTime: STALE_TIME_MILLISECONDS, // time until data in cache considered stale if cache not invalidated
  cacheTime: CACHE_TIME_MILLISECONDS, // time before cache labeled as inactive to be garbage collected
};

export const buildGetItem = (id) => ({
  queryKey: buildItemKey(id),
  queryFn: () => Api.getItem(id).then((data) => Map(data)),
  ...itemQueryConfig,
});

export const buildOwnItems = () => ({
  queryKey: OWN_ITEMS_KEY,
  queryFn: () => Api.getOwnItems().then((data) => List(data)),

  ...itemQueryConfig,
});

export const buildChildren = (id) => ({
  queryKey: buildItemChildrenKey(id),
  queryFn: () => Api.getChildren(id).then((data) => List(data)),
  ...itemQueryConfig,
});
export const buildParents = ({ id, path }) => ({
  queryKey: buildItemParentsKey(id),
  queryFn: () => Api.getParents({ path }).then((data) => List(data)),
  ...itemQueryConfig,
});

export const buildSharedItems = () => ({
  queryKey: SHARED_ITEMS_KEY,
  queryFn: () => Api.getSharedItems().then((data) => List(data)),
  ...itemQueryConfig,
});
