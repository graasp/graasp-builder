import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import { hooks } from '../../../config/queryClient';
import { LayoutContext } from '../../context/LayoutContext';
import { isSettingsEditionAllowedForUser } from '../../../utils/membership';
import {
  buildSettingsButtonId,
  ITEM_SETTINGS_BUTTON_CLASS,
} from '../../../config/selectors';

function ItemSettingsButton({ id }) {
  const { setIsItemSettingsOpen, isItemSettingsOpen } = useContext(
    LayoutContext,
  );
  const { data: memberships } = hooks.useItemMemberships(id);
  const { data: user, isError } = hooks.useCurrentMember();
  const memberId = user?.get('id');
  const { t } = useTranslation();

  // on unmount close item settings
  useEffect(
    () => () => {
      setIsItemSettingsOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // settings are not available for user without edition membership
  if (isError || !isSettingsEditionAllowedForUser({ memberships, memberId })) {
    return null;
  }

  const onClickSettings = () => {
    setIsItemSettingsOpen(!isItemSettingsOpen);
  };

  return (
    <Tooltip title={t('Settings')}>
      <IconButton
        onClick={onClickSettings}
        className={ITEM_SETTINGS_BUTTON_CLASS}
        id={buildSettingsButtonId(id)}
      >
        {isItemSettingsOpen ? <CloseIcon /> : <SettingsIcon />}
      </IconButton>
    </Tooltip>
  );
}

ItemSettingsButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ItemSettingsButton;
