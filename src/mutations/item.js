import * as Api from '../api';
import {
  COPY_ITEM_ERROR,
  COPY_ITEM_SUCCESS,
  CREATE_ITEM_ERROR,
  CREATE_ITEM_SUCCESS,
  DELETE_ITEMS_ERROR,
  DELETE_ITEMS_SUCCESS,
  DELETE_ITEM_ERROR,
  DELETE_ITEM_SUCCESS,
  EDIT_ITEM_ERROR,
  EDIT_ITEM_SUCCESS,
  MOVE_ITEM_ERROR,
  MOVE_ITEM_SUCCESS,
  SHARE_ITEM_ERROR,
  SHARE_ITEM_SUCCESS,
  UPLOAD_FILE_ERROR,
  UPLOAD_FILE_SUCCESS,
} from '../types';
import {
  buildItemChildrenKey,
  buildItemKey,
  getKeyForParentId,
  POST_ITEM_MUTATION_KEY,
  DELETE_ITEM_MUTATION_KEY,
  EDIT_ITEM_MUTATION_KEY,
  FILE_UPLOAD_MUTATION_KEY,
  SHARE_ITEM_MUTATION_KEY,
  MOVE_ITEM_MUTATION_KEY,
  COPY_ITEM_MUTATION_KEY,
  DELETE_ITEMS_MUTATION_KEY,
} from '../config/keys';
import notifier from '../middlewares/notifier';
import { buildPath, getDirectParentId } from '../utils/item';

export default (queryClient) => {
  const mutateItem = async ({ id, value }) => {
    const itemKey = buildItemKey(id);

    await queryClient.cancelQueries(itemKey);

    // Snapshot the previous value
    const prevValue = queryClient.getQueryData(itemKey);

    queryClient.setQueryData(itemKey, value);

    // Return a context object with the snapshotted value
    return prevValue;
  };

  const mutateParentItem = async ({ id, childPath, value }) => {
    const parentId = id || getDirectParentId(childPath);

    // get parent key
    const parentKey = getKeyForParentId(parentId);

    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(parentKey);

    // Snapshot the previous value
    const prevParent = queryClient.getQueryData(parentKey);

    // Optimistically update
    queryClient.setQueryData(parentKey, value);

    // Return a context object with the snapshotted value
    return prevParent;
  };

  const onErrorParentItem = ({ id, childPath, prevValue }) => {
    const parentKey = getKeyForParentId(id || getDirectParentId(childPath));
    queryClient.setQueryData(parentKey, prevValue);
  };

  const onErrorItem = ({ id, prevValue }) => {
    const itemKey = buildItemKey(id);
    queryClient.setQueryData(itemKey, prevValue);
  };

  const onSettledParentItem = ({ id, childPath }) => {
    const parentKey = getKeyForParentId(id || getDirectParentId(childPath));
    queryClient.invalidateQueries(parentKey);
  };

  const onSettledItem = ({ id }) => {
    const itemKey = buildItemKey(id);
    queryClient.invalidateQueries(itemKey);
  };

  queryClient.setMutationDefaults(POST_ITEM_MUTATION_KEY, {
    mutationFn: async (item) => ({
      parentId: item.parentId,
      item: await Api.postItem(item),
    }),
    // we cannot optimistically add an item because we need its id
    onSuccess: () => {
      notifier({ type: CREATE_ITEM_SUCCESS });
    },
    onError: (error) => {
      notifier({ type: CREATE_ITEM_ERROR, payload: { error } });
    },
    onSettled: (newItem) => {
      const key = getKeyForParentId(newItem?.parentId);
      queryClient.invalidateQueries(key);
    },
  });

  queryClient.setMutationDefaults(EDIT_ITEM_MUTATION_KEY, {
    mutationFn: (item) => Api.editItem(item),
    onMutate: async (newItem) => {
      const previousItems = {
        parent: await mutateParentItem({
          childPath: newItem.path,
          valueFn: (old) => {
            const idx = old.indexOf(({ id }) => id === newItem.id);
            return old.set(idx, newItem);
          },
        }),
        item: await mutateItem(queryClient, { id: newItem.id, value: newItem }),
      };

      return previousItems;
    },
    onSuccess: () => {
      notifier({ type: EDIT_ITEM_SUCCESS });
    },
    onError: (error, newItem, context) => {
      onErrorParentItem({ childPath: newItem.path, prevValue: context.parent });
      onErrorItem({ id: newItem.id, prevValue: context.item });
      notifier({ type: EDIT_ITEM_ERROR, payload: { error } });
    },
    onSettled: (newItem) => {
      onSettledParentItem({ childPath: newItem.path });
      onSettledItem({ id: newItem.id });
    },
  });

  queryClient.setMutationDefaults(DELETE_ITEM_MUTATION_KEY, {
    mutationFn: ([itemId]) => Api.deleteItem(itemId).then(() => itemId),

    onMutate: async ([itemId]) => {
      const itemKey = buildItemKey(itemId);
      const itemData = queryClient.getQueryData(itemKey);
      const previousItems = {};
      if (itemData) {
        previousItems.parent = await mutateParentItem({
          childPath: itemData.get('path'),
          value: (old) => old.filter(({ id }) => id !== itemId),
        });
        previousItems.item = await mutateItem({ id: itemId, value: null });
      }
      return previousItems;
    },
    onSuccess: () => {
      notifier({ type: DELETE_ITEM_SUCCESS });
    },
    onError: (error, itemId, context) => {
      const itemData = context.item;

      if (itemData) {
        onErrorItem({ id: itemId, prevValue: context.item });
        onErrorParentItem({
          childPath: itemData.get('path'),
          prevValue: context.parent,
        });
      }
      notifier({ type: DELETE_ITEM_ERROR, payload: { error } });
    },
    onSettled: (itemId, error, variables, context) => {
      const itemData = context.item;

      if (itemData) {
        onSettledItem({ id: itemId });
        onSettledParentItem({ childPath: itemData.get('path') });
      }
    },
  });

  queryClient.setMutationDefaults(DELETE_ITEMS_MUTATION_KEY, {
    mutationFn: (itemIds) => Api.deleteItems(itemIds).then(() => itemIds),

    onMutate: async (itemIds) => {
      // get path from first item
      const itemKey = buildItemKey(itemIds[0]);
      const itemPath = queryClient.getQueryData(itemKey)?.get('path');

      const previousItems = {};
      if (itemPath) {
        previousItems.parent = await mutateParentItem({
          childPath: itemPath,
          value: (old) => old.filter(({ id }) => !itemIds.includes(id)),
        });
      }

      itemIds.forEach(async (id) => {
        previousItems[id] = await mutateItem({ id, value: null });
      });

      return previousItems;
    },
    onSuccess: () => {
      notifier({ type: DELETE_ITEMS_SUCCESS });
    },
    onError: (error, itemIds, context) => {
      const itemPath = context[itemIds[0]]?.get('path');

      if (itemPath) {
        onErrorParentItem({
          childPath: itemPath,
          prevValue: context.parent,
        });
      }

      itemIds.forEach((id) => {
        onErrorItem({ id, prevValue: context[id] });
      });

      notifier({ type: DELETE_ITEMS_ERROR, payload: { error } });
    },
    onSettled: (itemIds) => {
      const itemPath = context[itemIds[0]]?.get('path');

      itemIds.forEach((id) => onSettledItem({ id }));

      if (itemPath) {
        onSettledParentItem({ childPath: itemPath });
      }
    },
  });

  queryClient.setMutationDefaults(COPY_ITEM_MUTATION_KEY, {
    mutationFn: (payload) =>
      Api.copyItem(payload).then((newItem) => ({
        to: payload.to,
        ...newItem,
      })),
    // cannot mutate because it needs the id
    onSuccess: () => {
      notifier({ type: COPY_ITEM_SUCCESS });
    },
    onError: (error) => {
      notifier({ type: COPY_ITEM_ERROR, payload: { error } });
    },
    onSettled: (newItem) => {
      onSettledParentItem({ id: newItem?.to });
    },
  });

  queryClient.setMutationDefaults(MOVE_ITEM_MUTATION_KEY, {
    mutationFn: (payload) => Api.moveItem(payload).then(() => payload),
    onMutate: async ({ id: itemId, to }) => {
      const itemKey = buildItemKey(itemId);
      const itemData = queryClient.getQueryData(itemKey);
      const previousItems = {};
      if (itemData) {
        // add item in target folder
        previousItems.targetParent = await mutateParentItem({
          id: to,
          value: (old) => old.push(itemData),
        });

        // remove item in original folder
        previousItems.originalParent = await mutateParentItem({
          childPath: itemData.get('path'),
          value: (old) => old?.filter(({ id }) => id !== itemId),
        });

        // update item's path
        const originalParentItemData = queryClient.getQueryData(itemKey);
        previousItems.item = await mutateItem({
          id: itemId,
          value: (item) =>
            item.set(
              'path',
              buildPath({
                prefix: originalParentItemData.get('path'),
                ids: [itemId],
              }),
            ),
        });
      }
      return previousItems;
    },
    onSuccess: () => {
      notifier({ type: MOVE_ITEM_SUCCESS });
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, { id, to }, context) => {
      onErrorItem({ id, prevValue: context.item });
      onErrorParentItem({ id: to, prevValue: context.targetParent });
      const itemData = context.item;
      if (itemData) {
        onErrorParentItem({
          childPath: itemData.get('path'),
          prevValue: context.originalParent,
        });
      }
      notifier({ type: MOVE_ITEM_ERROR, payload: { error } });
    },
    // Always refetch after error or success:
    onSettled: ({ id, to }) => {
      onSettledParentItem({ id: to });
      onSettledItem({ id });
      const itemData = queryClient.getQueryData(id);
      if (itemData) {
        onSettledParentItem({ childPath: itemData.get('path') });
      }
    },
  });

  queryClient.setMutationDefaults(SHARE_ITEM_MUTATION_KEY, {
    mutationFn: (payload) => Api.shareItemWith(payload).then(() => payload),
    onSuccess: () => {
      notifier({ type: SHARE_ITEM_SUCCESS });
    },
    onError: (error) => {
      notifier({ type: SHARE_ITEM_ERROR, payload: { error } });
    },
    onSettled: ({ id }) => {
      onSettledItem({ id });

      // invalidate children since membership will also change for them
      queryClient.invalidateQueries(buildItemChildrenKey(id));
    },
  });

  // this mutation is used for its callback
  queryClient.setMutationDefaults(FILE_UPLOAD_MUTATION_KEY, {
    mutationFn: ({ id, error }) => Promise.resolve({ id, error }),
    onSuccess: ({ error }) => {
      if (!error) {
        notifier({ type: UPLOAD_FILE_SUCCESS });
      } else {
        notifier({ type: UPLOAD_FILE_ERROR, payload: { error } });
      }
    },
    onSettled: ({ id }) => {
      onSettledParentItem({ id });
    },
  });
};
