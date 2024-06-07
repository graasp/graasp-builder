import { useEffect, useState } from 'react';

import {
  ItemPublished,
  ItemValidation,
  ItemValidationGroup,
  ItemValidationStatus,
  PackedItem,
} from '@graasp/sdk';

import groupBy from 'lodash.groupby';

import { hooks } from '@/config/queryClient';
import { PublicationStatus } from '@/types/publication';

const { useLastItemValidationGroup, useItemPublishedInformation } = hooks;

const containValidationStatus = (
  mapByStatus: { [status: string]: ItemValidation[] },
  status: ItemValidationStatus,
) => (mapByStatus[status] ?? []).length > 0;

const isValidationOutdated = ({
  item,
  validationGroup,
}: {
  item: PackedItem;
  validationGroup?: ItemValidationGroup;
}) => validationGroup && validationGroup.createdAt <= item.updatedAt;

const computeValidationSuccess = ({
  publishedEntry,
}: {
  publishedEntry?: ItemPublished;
}) => {
  if (publishedEntry) {
    return PublicationStatus.Published;
  }

  return PublicationStatus.ReadyToPublish;
};

const isUnpublished = (validationGroup?: ItemValidationGroup) =>
  !validationGroup;

const isNotPublic = ({
  item,
  publishedEntry,
}: {
  item: PackedItem;
  publishedEntry?: ItemPublished;
}) => !item.public && Boolean(publishedEntry);

const isPublishedChildren = ({
  item,
  publishedEntry,
}: {
  item: PackedItem;
  publishedEntry?: ItemPublished;
}) => Boolean(publishedEntry) && publishedEntry?.item?.path !== item?.path;

type Props = { item: PackedItem };
type UsePublicationStatus = {
  status: PublicationStatus;
  isLoading: boolean;
  isinitialLoading: boolean;
};

const computePublicationStatus = ({
  item,
  publishedEntry,
  validationGroup,
}: {
  item: PackedItem;
  publishedEntry?: ItemPublished;
  validationGroup?: ItemValidationGroup;
}): PublicationStatus => {
  const mapByStatus = groupBy(
    validationGroup?.itemValidations,
    ({ status }) => status,
  );

  switch (true) {
    case isPublishedChildren({ item, publishedEntry }):
      return PublicationStatus.PublishedChildren;
    case isUnpublished(validationGroup):
      return PublicationStatus.Unpublished;
    case isValidationOutdated({ item, validationGroup }):
      return PublicationStatus.Outdated;
    case containValidationStatus(mapByStatus, ItemValidationStatus.Failure):
      return PublicationStatus.Invalid;
    case containValidationStatus(mapByStatus, ItemValidationStatus.Pending):
      return PublicationStatus.Pending;
    case isNotPublic({ item, publishedEntry }):
      return PublicationStatus.NotPublic;
    case containValidationStatus(mapByStatus, ItemValidationStatus.Success):
      return computeValidationSuccess({ publishedEntry });
    default:
      return PublicationStatus.Invalid;
  }
};

export const usePublicationStatus = ({ item }: Props): UsePublicationStatus => {
  const { data: itemPublishedEntry, isLoading: isPublishedLoading } =
    useItemPublishedInformation({
      itemId: item.id,
    });
  const { data: lastItemValidationGroup, isLoading: isValidationLoading } =
    useLastItemValidationGroup(item.id);
  const [status, setStatus] = useState<PublicationStatus>();
  const isLoading = isPublishedLoading || isValidationLoading;
  const isinitialLoading = isLoading && !status;

  useEffect(() => {
    if (!isLoading) {
      setStatus(
        computePublicationStatus({
          item,
          publishedEntry: itemPublishedEntry ?? undefined,
          validationGroup: lastItemValidationGroup,
        }),
      );
    }
  }, [itemPublishedEntry, lastItemValidationGroup, item, isLoading]);

  return {
    status: status ?? PublicationStatus.Unpublished,
    isLoading,
    isinitialLoading,
  };
};

export default usePublicationStatus;
