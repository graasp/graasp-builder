import { RecordOf } from 'immutable';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { FC } from 'react';

import { Item, PermissionLevel } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { isItemPublic } from '../../../utils/itemTag';
import ItemPublishConfiguration from './ItemPublishConfiguration';

const { useTags, useItemTags } = hooks;

type Props = {
  item: RecordOf<Item>;
  permission?: PermissionLevel;
};

const ItemPublishTab: FC<Props> = ({
  item,
  permission = PermissionLevel.Read,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(
    item?.id,
  );

  const isPublic = isItemPublic({ tags, itemTags });
  const canPublish = permission === PermissionLevel.ADMIN && isPublic;

  if (isTagsLoading || isItemTagsLoading) {
    return <Loader />;
  }

  return (
    <Box m={2}>
      {canPublish ? (
        <ItemPublishConfiguration item={item} />
      ) : (
        <Typography variant="body1">
          {translateBuilder(
            BUILDER.LIBRARY_SETTINGS_NOT_PUBLISHED_ITEM_MESSAGE,
          )}
        </Typography>
      )}
    </Box>
  );
};

export default ItemPublishTab;
