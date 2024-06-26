import { useEffect, useMemo, useState } from 'react';

import {
  ItemLoginSchema,
  ItemLoginSchemaType,
  ItemPublished,
  ItemTag,
  ItemTagType,
  PackedItem,
} from '@graasp/sdk';

import { SETTINGS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';

const { useItemLoginSchema, useItemPublishedInformation } = hooks;
const {
  useDeleteItemTag,
  usePostItemTag,
  useUnpublishItem,
  useDeleteItemLoginSchema,
  usePutItemLoginSchema,
} = mutations;

type UseVisibility = {
  isLoading: boolean;
  isError: boolean;
  isDisabled: boolean;
  itemPublishEntry: ItemPublished | null | undefined;
  itemLoginSchema: ItemLoginSchema | undefined;
  publicTag: ItemTag | undefined;
  visibility: string | undefined;
  updateVisibility: (newTag: string) => Promise<void>;
};

export const useVisibility = (item: PackedItem): UseVisibility => {
  const { mutateAsync: postItemTag } = usePostItemTag();
  const { mutate: deleteItemTag } = useDeleteItemTag();

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
  const { mutate: deleteItemLoginSchema } = useDeleteItemLoginSchema();
  const { mutate: putItemLoginSchema } = usePutItemLoginSchema();

  // is disabled
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    // disable setting if any visiblity is set on any parent items
    setIsDisabled(
      Boolean(
        (itemLoginSchema && itemLoginSchema?.item?.path !== item?.path) ||
          (item?.public && item?.public?.item?.path !== item?.path),
      ),
    );
  }, [itemLoginSchema, item]);

  // is loading
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(isItemPublishEntryLoading || isItemLoginLoading);
  }, [isItemPublishEntryLoading, isItemLoginLoading]);

  // is error
  const [isError] = useState(false);

  // visibility
  const [visibility, setVisibility] = useState<string>();
  useEffect(() => {
    switch (true) {
      case Boolean(item.public): {
        setVisibility(SETTINGS.ITEM_PUBLIC.name);
        break;
      }
      case Boolean(itemLoginSchema?.id): {
        setVisibility(SETTINGS.ITEM_LOGIN.name);
        break;
      }
      default:
        setVisibility(SETTINGS.ITEM_PRIVATE.name);
    }
  }, [itemPublishEntry, item, itemLoginSchema]);

  const updateVisibility = useMemo(
    () => async (newTag: string) => {
      // deletes both public and published tags if they exists
      const deletePublishedAndPublic = () => {
        if (itemPublishEntry) {
          unpublish({ id: item.id });
        }

        if (item.public) {
          deleteItemTag({ itemId: item.id, type: ItemTagType.Public });
        }
      };

      const deleteLoginSchema = () => {
        if (itemLoginSchema) {
          deleteItemLoginSchema({
            itemId: item.id,
          });
        }
      };

      switch (newTag) {
        case SETTINGS.ITEM_PRIVATE.name: {
          deletePublishedAndPublic();
          deleteLoginSchema();
          break;
        }
        case SETTINGS.ITEM_LOGIN.name: {
          deletePublishedAndPublic();
          putItemLoginSchema({
            itemId: item.id,
            type: ItemLoginSchemaType.Username,
          });
          break;
        }
        case SETTINGS.ITEM_PUBLIC.name: {
          await postItemTag({
            itemId: item.id,
            type: ItemTagType.Public,
          });
          deleteLoginSchema();
          break;
        }
        default:
          break;
      }
    },
    [
      deleteItemLoginSchema,
      deleteItemTag,
      item.id,
      itemLoginSchema,
      itemPublishEntry,
      postItemTag,
      item.public,
      putItemLoginSchema,
      unpublish,
    ],
  );

  return useMemo(
    () => ({
      isLoading,
      isError,
      isDisabled,
      itemPublishEntry,
      itemLoginSchema,
      publicTag: item.public,
      visibility,
      updateVisibility,
    }),
    [
      isLoading,
      isError,
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
