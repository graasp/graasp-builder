import { useEffect, useState } from 'react';

import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  ItemLoginSchemaType,
  ItemTag,
  ItemTagType,
} from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { SETTINGS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import { SHARE_ITEM_VISIBILITY_SELECT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import ItemLoginSchemaSelect from './ItemLoginSchemaSelect';

const { useItemTags, useItemLoginSchema, useItemPublishedInformation } = hooks;
const {
  useDeleteItemTag,
  usePostItemTag,
  useUnpublishItem,
  useDeleteItemLoginSchema,
  usePutItemLoginSchema,
} = mutations;

type Props = {
  item: DiscriminatedItem;
  edit?: boolean;
};

const useVisibility = (item: DiscriminatedItem) => {
  const [itemId] = useState(item.id);

  // get item public
  const {
    data: itemTags,
    isLoading: isItemTagsLoading,
    isError: isItemTagsError,
  } = useItemTags(itemId);
  const { mutate: postItemTag } = usePostItemTag();
  const { mutate: deleteItemTag } = useDeleteItemTag();
  const [publicTag, setPublicTag] = useState<ItemTag | undefined>();
  useEffect(() => {
    setPublicTag(itemTags?.find(({ type }) => type === ItemTagType.Public));
  }, [itemTags]);

  // get item published
  const { data: itemPublishEntry, isLoading: isItemPublishEntryLoading } =
    useItemPublishedInformation({ itemId }, { enabled: Boolean(publicTag) });
  const { mutate: unpublish } = useUnpublishItem();

  // item login tag and item extra value
  const { data: itemLoginSchema, isLoading: isItemLoginLoading } =
    useItemLoginSchema({ itemId });
  const { mutate: deleteItemLoginSchema } = useDeleteItemLoginSchema();
  const { mutate: putItemLoginSchema } = usePutItemLoginSchema();

  // is disabled
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    // disable setting if any visiblity is set on any parent items
    setIsDisabled(
      Boolean(
        (itemLoginSchema && itemLoginSchema?.item?.path !== item?.path) ||
          (publicTag && publicTag?.item?.path !== item?.path),
      ),
    );
  }, [publicTag, itemLoginSchema, item]);

  // is loading
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(
      isItemPublishEntryLoading || isItemTagsLoading || isItemLoginLoading,
    );
  }, [isItemPublishEntryLoading, isItemTagsLoading, isItemLoginLoading]);

  // is error
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    setIsError(isItemTagsError);
  }, [isItemTagsError]);

  // visibility
  const [visibility, setVisibility] = useState<string>();
  useEffect(() => {
    switch (true) {
      case Boolean(publicTag?.id): {
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
  }, [itemPublishEntry, publicTag, itemLoginSchema]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newTag = event.target.value;

    // deletes both public and published tags if they exists
    const deletePublishedAndPublic = () => {
      if (itemPublishEntry) {
        unpublish({ id: itemId });
      }

      if (publicTag) {
        deleteItemTag({ itemId, type: ItemTagType.Public });
      }
    };

    const deleteLoginSchema = () => {
      if (itemLoginSchema) {
        deleteItemLoginSchema({
          itemId,
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
          itemId,
          type: ItemLoginSchemaType.Username,
        });
        break;
      }
      case SETTINGS.ITEM_PUBLIC.name: {
        postItemTag({
          itemId,
          type: ItemTagType.Public,
        });
        deleteLoginSchema();
        break;
      }
      default:
        break;
    }
  };

  return {
    isLoading,
    isError,
    isDisabled,
    itemPublishEntry,
    itemLoginSchema,
    publicTag,
    visibility,
    handleChange,
  };
};

const VisibilitySelect = ({ item, edit }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    visibility,
    isError,
    isDisabled,
    itemLoginSchema,
    isLoading,
    handleChange,
  } = useVisibility(item);

  if (isLoading) {
    return <Loader />;
  }

  // hide visibility select if cannot access item tags
  // this happens when accessing a public item
  if (isError) {
    return null;
  }

  const renderVisiblityIndication = () => {
    switch (visibility) {
      case SETTINGS.ITEM_LOGIN.name:
        return (
          <>
            {translateBuilder(
              BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_SELECT_MESSAGE,
            )}
            <ItemLoginSchemaSelect
              itemLoginSchema={itemLoginSchema}
              isDisabled={isDisabled}
              itemId={item.id}
              edit={edit}
            />
          </>
        );
      case SETTINGS.ITEM_PUBLIC.name:
        return translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_INFORMATIONS,
        );
      case SETTINGS.ITEM_PRIVATE.name:
      default:
        return translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_INFORMATION,
        );
    }
  };

  return (
    <>
      {edit && (
        <Select
          value={visibility}
          onChange={handleChange}
          disabled={isDisabled}
          id={SHARE_ITEM_VISIBILITY_SELECT_ID}
          sx={{ mr: 1 }}
        >
          <MenuItem value={SETTINGS.ITEM_PRIVATE.name}>
            {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_LABEL)}
          </MenuItem>
          <MenuItem value={SETTINGS.ITEM_LOGIN.name}>
            {translateBuilder(
              BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_LABEL,
            )}
          </MenuItem>
          <MenuItem value={SETTINGS.ITEM_PUBLIC.name}>
            {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_LABEL)}
          </MenuItem>
        </Select>
      )}
      {renderVisiblityIndication()}
      {isDisabled && (
        <Typography variant="body2">
          {translateBuilder(
            BUILDER.ITEM_SETTINGS_VISIBILITY_CANNOT_EDIT_PARENT_MESSAGE,
          )}
        </Typography>
      )}
    </>
  );
};
export default VisibilitySelect;
