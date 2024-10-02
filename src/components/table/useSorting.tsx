import { Dispatch, useState } from 'react';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { Ordering } from '@/enums';

import {
  AllSortingOptions,
  SortingOptions,
  SortingOptionsForFolder,
} from './types';

export const useSorting = <T extends AllSortingOptions = SortingOptions>({
  sortBy: s,
  ordering: o = Ordering.DESC,
}: {
  sortBy?: T;
  ordering: Ordering;
}): {
  sortBy: T;
  ordering: Ordering;
  setSortBy: Dispatch<T>;
  setOrdering: Dispatch<Ordering>;
  sortFn: (a: DiscriminatedItem, b: DiscriminatedItem) => number;
} => {
  const [sortBy, setSortBy] = useState<T>(
    s ?? (SortingOptions.ItemUpdatedAt as T),
  );
  const [ordering, setOrdering] = useState<Ordering>(o);

  const sortFn = (a: DiscriminatedItem, b: DiscriminatedItem) => {
    const f = ordering === Ordering.ASC ? 1 : -1;
    let value = 0;
    switch (sortBy) {
      case SortingOptions.ItemName:
        value = a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        break;
      case SortingOptions.ItemCreator:
        if (!a.creator) {
          value = -1;
        } else if (!b.creator) {
          value = 1;
        } else {
          value =
            a.creator?.name?.toLowerCase() > b.creator?.name?.toLowerCase()
              ? 1
              : -1;
        }
        break;
      case SortingOptions.ItemType:
        value = a.type > b.type ? 1 : -1;
        break;
      case SortingOptions.ItemUpdatedAt:
        value = a.updatedAt > b.updatedAt ? 1 : -1;
        break;
      case SortingOptionsForFolder.Order:
      default:
        value = 0;
    }

    return value * f;
  };

  return { sortBy, ordering, setSortBy, setOrdering, sortFn };
};

export const useTranslatedSortingOptions = (): SortingOptions[] => {
  const { t } = useBuilderTranslation();

  return Object.values(SortingOptions).sort((t1, t2) =>
    t(t1).localeCompare(t(t2)),
  );
};
