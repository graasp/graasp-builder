import {
  buildItemTagsKey,
  DELETE_ITEM_TAG_MUTATION_KEY,
  POST_ITEM_TAG_MUTATION_KEY,
} from '../config/keys';
import notifier from '../middlewares/notifier';
import {
  DELETE_ITEM_TAG_ERROR,
  DELETE_ITEM_TAG_SUCCESS,
  POST_ITEM_TAG_ERROR,
  POST_ITEM_TAG_SUCCESS,
} from '../types';
import * as Api from '../api';

// payload: { id, tagId, itemPath, creator }
export default (queryClient) => {
  queryClient.setMutationDefaults(POST_ITEM_TAG_MUTATION_KEY, {
    mutationFn: (payload) => Api.postItemTag(payload).then(() => payload),
    onSuccess: () => {
      notifier({ type: POST_ITEM_TAG_SUCCESS });
    },
    onError: (error) => {
      notifier({ type: POST_ITEM_TAG_ERROR, payload: { error } });
    },
    onSettled: ({ id }) => {
      queryClient.invalidateQueries(buildItemTagsKey(id));
    },
  });

  // payload {id, tagId}
  queryClient.setMutationDefaults(DELETE_ITEM_TAG_MUTATION_KEY, {
    mutationFn: (payload) => Api.deleteItemTag(payload).then(() => payload),
    onMutate: async ({ id, tagId }) => {
      const itemKey = buildItemTagsKey(id);
      await queryClient.cancelQueries(itemKey);

      // Snapshot the previous value
      const prevValue = queryClient.getQueryData(itemKey);

      queryClient.setQueryData(itemKey, (old) =>
        old.filter(({ id: tId }) => tId !== tagId),
      );
      return prevValue;
    },
    onSuccess: () => {
      notifier({ type: DELETE_ITEM_TAG_SUCCESS });
    },
    onError: (error, { id }, context) => {
      const itemKey = buildItemTagsKey(id);
      queryClient.setQueryData(itemKey, context.prevValue);
      notifier({ type: DELETE_ITEM_TAG_ERROR, payload: { error } });
    },
    onSettled: ({ id }) => {
      queryClient.invalidateQueries(buildItemTagsKey(id));
    },
  });
};
