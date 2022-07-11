import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Loader } from '@graasp/ui';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LayoutContext } from '../../context/LayoutContext';
import { hooks } from '../../../config/queryClient';
import ItemPublishConfiguration from './ItemPublishConfiguration';
import { PERMISSION_LEVELS } from '../../../enums';
import { isItemPublic } from '../../../utils/itemTag';

const { useTags, useItemTags } = hooks;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
}));

const ItemPublishTab = ({ item, permission }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(
    item?.get('id'),
  );
  const { setIsItemPublishOpen } = useContext(LayoutContext);

  const isPublic = isItemPublic({ tags, itemTags });
  const canPublish = permission === PERMISSION_LEVELS.ADMIN && isPublic;

  useEffect(
    () => () => {
      setIsItemPublishOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (isTagsLoading || isItemTagsLoading) {
    return <Loader />;
  }

  return (
    <Container disableGutters className={classes.wrapper}>
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
  item: PropTypes.instanceOf(Map).isRequired,
  permission: PropTypes.oneOf(PERMISSION_LEVELS),
};

ItemPublishTab.defaultProps = {
  permission: PERMISSION_LEVELS.READ,
};

export default ItemPublishTab;
