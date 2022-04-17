import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Loader } from '@graasp/ui';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getHighestPermissionForMemberFromMemberships } from '../../../utils/membership';
import { LayoutContext } from '../../context/LayoutContext';
import { CurrentUserContext } from '../../context/CurrentUserContext';
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

const ItemPublishTab = ({ item, memberships }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentUserContext);
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(
    item?.get('id'),
  );
  const { setIsItemPublishOpen } = useContext(LayoutContext);

  const hasAdminPermission =
    getHighestPermissionForMemberFromMemberships({
      memberships,
      memberId: currentMember?.get('id'),
    })?.permission === PERMISSION_LEVELS.ADMIN;

  const isPublic = isItemPublic({ tags, itemTags });
  const canPublish = hasAdminPermission && isPublic;

  useEffect(
    () => () => {
      setIsItemPublishOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (isLoadingCurrentMember || isTagsLoading || isItemTagsLoading) {
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
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
export default ItemPublishTab;
