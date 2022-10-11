import { Record } from 'immutable';
import PropTypes from 'prop-types';

import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { useTranslation } from 'react-i18next';

import { Loader } from '@graasp/ui';

import { hooks } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
import { isItemPublic } from '../../../utils/itemTag';
import ItemPublishConfiguration from './ItemPublishConfiguration';

const { useTags, useItemTags } = hooks;

const ItemPublishTab = ({ item, permission }) => {
  const { t } = useTranslation();
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
          {t(
            'Only user with admin rights can publish item and item should be set to public before publishing.',
          )}
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
