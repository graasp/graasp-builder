import { useQuery } from 'react-query';
import { Map } from 'immutable';
import { buildItemKey } from '../config/keys';
import queryClient from '../config/queryClient';
import {
  buildChildren,
  buildGetItem,
  buildOwnItems,
  buildParents,
  buildSharedItems,
} from './utils';

export const useOwnItems = () =>
  useQuery({
    ...buildOwnItems(),
    onSuccess: async (items) => {
      // save items in their own key
      items?.forEach(async (item) => {
        const { id } = item;
        queryClient.setQueryData(buildItemKey(id), Map(item));
      });
    },
  });

export const useChildren = (itemId) =>
  useQuery({
    ...buildChildren(itemId),
    onSuccess: async (items) => {
      if (items?.size) {
        // save items in their own key
        items.forEach(async (item) => {
          const { id } = item;
          queryClient.setQueryData(buildItemKey(id), Map(item));
        });
      }
    },
    enabled: Boolean(itemId),
  });

export const useParents = ({ id, path, enabled }) =>
  useQuery({
    ...buildParents({ id, path }),
    onSuccess: async (items) => {
      if (items?.size) {
        // save items in their own key
        items.forEach(async (item) => {
          const { id: itemId } = item;
          queryClient.setQueryData(buildItemKey(itemId), Map(item));
        });
      }
    },
    enabled: enabled && Boolean(id),
  });

export const useSharedItems = () =>
  useQuery({
    ...buildSharedItems(),
    onSuccess: async (items) => {
      // save items in their own key
      items.forEach(async (item) => {
        const { id } = item;
        queryClient.setQueryData(buildItemKey(id), Map(item));
      });
    },
  });

export const useItem = (id) =>
  useQuery({ ...buildGetItem(id), enabled: Boolean(id) });
