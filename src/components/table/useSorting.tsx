import { Dispatch, useState } from 'react';

import { PackedItem } from '@graasp/sdk';

import { useEnumsTranslation } from '@/config/i18n';
import { Ordering } from '@/enums';

// corresponds to the value that should be sent in the request
export enum SortingOptions {
  ItemName = 'item.name',
  ItemType = 'item.type',
  ItemCreator = 'item.creator.name',
  ItemUpdatedAt = 'item.updated_at',
}

// special sorting value for inside folders
// corresponds to the value that should be sent in the request
export enum SortingOptionsForFolder {
  ItemName = 'item.name',
  ItemType = 'item.type',
  ItemCreator = 'item.creator.name',
  ItemUpdatedAt = 'item.updated_at',
  Order = 'Order',
}

export type AllSortingOptions = SortingOptions | SortingOptionsForFolder;

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
  sortFn: (a: PackedItem, b: PackedItem) => number;
} => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [sortBy, setSortBy] = useState<T>(s ?? SortingOptions.ItemUpdatedAt);
  const [ordering, setOrdering] = useState<Ordering>(o);

  const sortFn = (a: PackedItem, b: PackedItem) => {
    const f = ordering === Ordering.ASC ? 1 : -1;
    let value = 0;
    switch (sortBy) {
      case SortingOptions.ItemName:
        value = a.name > b.name ? 1 : -1;
        break;
      case SortingOptions.ItemCreator:
        if (!a.creator) {
          value = -1;
        } else if (!b.creator) {
          value = 1;
        } else {
          value = a.creator?.name > b.creator?.name ? 1 : -1;
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
  const { t } = useEnumsTranslation();

  return Object.values(SortingOptions).sort((t1, t2) =>
    t(t1).localeCompare(t(t2)),
  );
};
