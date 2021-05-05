import { List, Map } from 'immutable';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import {
  buildItemChildrenKey,
  buildItemKey,
  buildItemLoginKey,
  buildItemMembershipsKey,
  buildItemParentsKey,
  buildItemTagsKey,
  ITEM_TAGS,
  OWN_ITEMS_KEY,
  SHARED_ITEMS_KEY,
} from '../config/keys';
import * as Api from '../api';
import {
  STALE_TIME_MILLISECONDS,
  CACHE_TIME_MILLISECONDS,
} from '../config/constants';

export const queryConfig = {
  staleTime: STALE_TIME_MILLISECONDS, // time until data in cache considered stale if cache not invalidated
  cacheTime: CACHE_TIME_MILLISECONDS, // time before cache labeled as inactive to be garbage collected
  retry: (failureCount, error) => {
    // do not retry if the request was not authorized
    // the user is probably not signed in
    if (error.name === getReasonPhrase(StatusCodes.UNAUTHORIZED)) {
      return 0;
    }
    return failureCount;
  },
};

export const buildGetItem = (id) => ({
  queryKey: buildItemKey(id),
  queryFn: () => Api.getItem(id).then((data) => Map(data)),
  ...queryConfig,
});

export const buildOwnItems = () => ({
  queryKey: OWN_ITEMS_KEY,
  queryFn: () => Api.getOwnItems().then((data) => List(data)),

  ...queryConfig,
});

export const buildChildren = (id) => ({
  queryKey: buildItemChildrenKey(id),
  queryFn: () => Api.getChildren(id).then((data) => List(data)),
  ...queryConfig,
});
export const buildParents = ({ id, path }) => ({
  queryKey: buildItemParentsKey(id),
  queryFn: () => Api.getParents({ path }).then((data) => List(data)),
  ...queryConfig,
});

export const buildSharedItems = () => ({
  queryKey: SHARED_ITEMS_KEY,
  queryFn: () => Api.getSharedItems().then((data) => List(data)),
  ...queryConfig,
});

export const buildItemMembershipsQuery = (id) => ({
  queryKey: buildItemMembershipsKey(id),
  queryFn: () => Api.getMembershipsForItem(id).then((data) => List(data)),
  ...queryConfig,
});

export const buildItemLoginQuery = (id) => ({
  queryKey: buildItemLoginKey(id),
  queryFn: () => Api.getItemLogin(id).then((data) => Map(data)),
  ...queryConfig,
});

export const buildTagsQuery = () => ({
  queryKey: ITEM_TAGS,
  queryFn: () => Api.getTags().then((data) => List(data)),
  ...queryConfig,
});

export const buildItemTagsQuery = (id) => ({
  queryKey: buildItemTagsKey(id),
  queryFn: () => Api.getItemTags(id).then((data) => List(data)),
  ...queryConfig,
});
