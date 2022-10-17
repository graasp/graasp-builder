import { RecordOf } from 'immutable';

import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { Item, PermissionLevel } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
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
  const { t } = useBuilderTranslation();
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(
    item?.id,
  );

  const isPublic = isItemPublic({ tags, itemTags });
  const canPublish = permission === PERMISSION_LEVELS.ADMIN && isPublic;

  if (isTagsLoading || isItemTagsLoading) {
    return <Loader />;
  }

  return (
    <Container disableGutters mt={2}>
      {canPublish ? (
        <ItemPublishConfiguration item={item} />
      ) : (
        <Typography variant="body1">
          {t(BUILDER.LIBRARY_SETTINGS_NOT_PUBLISHED_ITEM_MESSAGE)}
        </Typography>
      )}
    </Container>
  );
};

export default ItemPublishTab;
