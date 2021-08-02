import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import { LayoutContext } from './LayoutContext';
import { hooks } from '../../config/queryClient';
import ItemMemberships from '../item/ItemMemberships';
import { hasItemLoginEnabled, isItemPublic } from '../../utils/itemTag';
import { SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR } from '../../config/constants';
import { ACCESS_INDICATION_ID } from '../../config/selectors';

const AccessIndication = ({ itemId, onClick }) => {
  const { t } = useTranslation();

  const { data: tags, isLoading: isTagsLoading } = hooks.useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = hooks.useItemTags(
    itemId,
  );
  const { setIsItemSettingsOpen } = useContext(LayoutContext);

  const isPublic = isItemPublic({ itemTags, tags });
  const hasItemLogin = hasItemLoginEnabled({ itemTags, tags });

  const openSettings = () => {
    onClick();
    setIsItemSettingsOpen(true);
  };

  if (isTagsLoading || isItemTagsLoading) {
    return <Loader />;
  }

  // check tags and display access methods' indications
  let accessText = null;
  let tooltipText = null;
  if (isPublic) {
    accessText = t('Public');
    tooltipText = t('This item is public. Anyone can access this item.');
  } else if (hasItemLogin) {
    accessText = t('Anyone authenticated with the link');
    tooltipText = t(
      'This item enables item login. New users can access this item when they authenticate using the item login.',
    );
  }

  if (accessText && tooltipText) {
    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        id={ACCESS_INDICATION_ID}
      >
        <Grid item>
          <Typography variant="body1">
            {`${t('Access')}: ${accessText}`}
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title={tooltipText}>
            <IconButton
              aria-label="access information"
              color="primary"
              onClick={openSettings}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }

  // show memberships when the item is not public and does not allow item login
  return (
    <ItemMemberships
      onClick={openSettings}
      id={itemId}
      maxAvatar={SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR}
    />
  );
};

AccessIndication.propTypes = {
  onClick: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
};

export default AccessIndication;
