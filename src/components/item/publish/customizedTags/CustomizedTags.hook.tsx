import { useEffect } from 'react';

import { DiscriminatedItem } from '@graasp/sdk';

import { mutations } from '@/config/queryClient';

import { useDataSyncContext } from '../../../context/DataSyncContext';

const SYNC_STATUS_KEY = 'CustomizedTags';

type Props = {
  item: DiscriminatedItem;
  enableNotifications?: boolean;
};

type UseCustomizedTags = {
  tags: string[];
  hasTags: boolean;
  deleteTag: (removedTag: string) => void;
  saveTags: (newTags: string[]) => void;
};

export const useCustomizedTags = ({
  item,
  enableNotifications = true,
}: Props): UseCustomizedTags => {
  const { computeStatusFor } = useDataSyncContext();
  const { settings, id: itemId } = item;
  const tags = settings?.tags ?? [];
  const hasTags = tags.length > 0;

  const {
    mutate: updateCustomizedTags,
    isSuccess,
    isPending: isLoading,
    isError,
  } = mutations.useEditItem({
    enableNotifications,
  });

  useEffect(
    () => computeStatusFor(SYNC_STATUS_KEY, { isLoading, isSuccess, isError }),
    [isLoading, isSuccess, isError, computeStatusFor],
  );

  const saveTags = (newTags: string[]) => {
    updateCustomizedTags({
      id: itemId,
      settings: { tags: newTags },
    });
  };

  const deleteTag = (tagToDelete: string) => {
    saveTags(
      tags?.filter((t) => t.toLowerCase() !== tagToDelete.toLowerCase()),
    );
  };

  return {
    tags,
    hasTags,
    deleteTag,
    saveTags,
  };
};

export default useCustomizedTags;
