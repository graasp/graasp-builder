import PropTypes from 'prop-types';

import InfoIcon from '@mui/icons-material/Info';
import { Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Loader } from '@graasp/ui';

import { SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { ACCESS_INDICATION_ID } from '../../config/selectors';
import { hasItemLoginEnabled, isItemPublic } from '../../utils/itemTag';
import ItemMemberships from '../item/ItemMemberships';
import { LayoutContext } from './LayoutContext';

const AccessIndication = ({ itemId, onClick }) => {
  const { t } = useTranslation();

  const { data: tags, isLoading: isTagsLoading } = hooks.useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } =
    hooks.useItemTags(itemId);
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
