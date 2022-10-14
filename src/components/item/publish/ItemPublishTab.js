import { Record } from 'immutable';
import PropTypes from 'prop-types';

import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
import { isItemPublic } from '../../../utils/itemTag';
import ItemPublishConfiguration from './ItemPublishConfiguration';

const { useTags, useItemTags } = hooks;

const ItemPublishTab = ({ item, permission }) => {
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

ItemPublishTab.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
  permission: PropTypes.oneOf(PERMISSION_LEVELS),
};

ItemPublishTab.defaultProps = {
  permission: PERMISSION_LEVELS.READ,
};

export default ItemPublishTab;
