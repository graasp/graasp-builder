import { useEffect, useMemo, useState } from 'react';

import {
  ItemLoginSchema,
  ItemLoginSchemaStatus,
  ItemLoginSchemaType,
  ItemPublished,
  ItemVisibility,
  ItemVisibilityType,
  PackedItem,
} from '@graasp/sdk';

import { SETTINGS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';

import { useGuestMemberships } from './useGuestMemberships';

const { useItemLoginSchema, useItemPublishedInformation } = hooks;
const {
  useDeleteItemVisibility,
  usePostItemVisibility,
  useUnpublishItem,
  usePutItemLoginSchema,
} = mutations;

type UseVisibility = {
  isLoading: boolean;
  isDisabled: boolean;
  itemPublishEntry: ItemPublished | null | undefined;
  itemLoginSchema: ItemLoginSchema | undefined;
  publicVisibility: ItemVisibility | undefined;
  visibility: string | undefined;
  updateVisibility: (newVisibility: string) => Promise<void>;
};

export const useVisibility = (item: PackedItem): UseVisibility => {
  const { mutateAsync: postItemVisibility } = usePostItemVisibility();
  const { mutate: deleteItemVisibility } = useDeleteItemVisibility();
  const { mutate: deleteItemLoginSchema } =
    mutations.useDeleteItemLoginSchema();

  const { data: guestMemberships, isLoading: isGuestNbLoading } =
    useGuestMemberships(item.id);

  // get item published
  const { data: itemPublishEntry, isLoading: isItemPublishEntryLoading } =
    useItemPublishedInformation(
      { itemId: item.id },
      { enabled: Boolean(item.public) },
    );
  const { mutate: unpublish } = useUnpublishItem();

  // item login tag and item extra value
  const { data: itemLoginSchema, isLoading: isItemLoginLoading } =
    useItemLoginSchema({ itemId: item.id });
  const { mutate: putItemLoginSchema } = usePutItemLoginSchema();

  // is disabled
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    // disable setting if item login schema is enabled and is not defined on the current item
    const shouldItemLoginBeDisabled =
      itemLoginSchema &&
      itemLoginSchema?.status !== ItemLoginSchemaStatus.Disabled &&
      itemLoginSchema?.item?.path !== item?.path;

    // disable setting if item is public and is not defined on the current item
    const shouldPublicBeDisabled =
      item?.public && item?.public?.item?.path !== item?.path;

    setIsDisabled(Boolean(shouldItemLoginBeDisabled || shouldPublicBeDisabled));
  }, [itemLoginSchema, item]);

  // is loading
  const isLoading =
    isItemPublishEntryLoading || isItemLoginLoading || isGuestNbLoading;

  // visibility
  const [visibility, setVisibility] = useState<string>(
    SETTINGS.ITEM_PRIVATE.name,
  );
  useEffect(() => {
    switch (true) {
      case Boolean(item.public): {
        setVisibility(SETTINGS.ITEM_PUBLIC.name);
        break;
      }
      case Boolean(
        itemLoginSchema?.id &&
          itemLoginSchema.status !== ItemLoginSchemaStatus.Disabled,
      ): {
        setVisibility(SETTINGS.ITEM_LOGIN.name);
        break;
      }
      default:
        setVisibility(SETTINGS.ITEM_PRIVATE.name);
    }
  }, [itemPublishEntry, item, itemLoginSchema]);

  const updateVisibility = useMemo(
    () => async (newVisibility: string) => {
      // deletes both public and published visibilities if they exists
      const deletePublishedAndPublic = () => {
        if (itemPublishEntry) {
          unpublish({ id: item.id });
        }

        if (item.public) {
          deleteItemVisibility({
            itemId: item.id,
            type: ItemVisibilityType.Public,
          });
        }
      };

      const disableLoginSchema = () => {
        if (itemLoginSchema && guestMemberships) {
          // disable if contains data, delete otherwise
          if (guestMemberships.length) {
            putItemLoginSchema({
              itemId: item.id,
              status: ItemLoginSchemaStatus.Disabled,
            });
          } else {
            deleteItemLoginSchema({ itemId: item.id });
          }
        }
      };

      switch (newVisibility) {
        case SETTINGS.ITEM_PRIVATE.name: {
          deletePublishedAndPublic();
          disableLoginSchema();
          break;
        }
        case SETTINGS.ITEM_LOGIN.name: {
          deletePublishedAndPublic();
          putItemLoginSchema({
            itemId: item.id,
            type: ItemLoginSchemaType.Username,
            status: ItemLoginSchemaStatus.Active,
          });
          break;
        }
        case SETTINGS.ITEM_PUBLIC.name: {
          await postItemVisibility({
            itemId: item.id,
            type: ItemVisibilityType.Public,
          });
          disableLoginSchema();
          break;
        }
        default:
          break;
      }
    },
    [
      itemPublishEntry,
      item.public,
      item.id,
      unpublish,
      deleteItemVisibility,
      itemLoginSchema,
      guestMemberships,
      putItemLoginSchema,
      deleteItemLoginSchema,
      postItemVisibility,
    ],
  );

  return useMemo(
    () => ({
      isLoading,
      isDisabled,
      itemPublishEntry,
      itemLoginSchema,
      publicVisibility: item.public,
      visibility,
      updateVisibility,
    }),
    [
      isLoading,
      isDisabled,
      itemPublishEntry,
      itemLoginSchema,
      item.public,
      visibility,
      updateVisibility,
    ],
  );
};

export default useVisibility;
