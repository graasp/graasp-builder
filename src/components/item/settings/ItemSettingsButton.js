import React, { useContext } from 'react';
import { Loader } from '@graasp/ui';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import { hooks } from '../../../config/queryClient';
import { LayoutContext } from '../../context/LayoutContext';
import { isSettingsEditionAllowedForUser } from '../../../utils/membership';
import { ITEM_SETTINGS_BUTTON_CLASS } from '../../../config/selectors';

function ItemSettingsButton({ id }) {
  const { setIsItemSettingsOpen, isItemSettingsOpen } = useContext(
    LayoutContext,
  );
  const {
    data: memberships,
    isLoading: isMembershipsLoading,
  } = hooks.useItemMemberships(id);
  const { data: user, isLoading: isMemberLoading } = hooks.useCurrentMember();
  const memberId = user?.get('id');

  if (isMembershipsLoading || isMemberLoading) {
    return <Loader />;
  }

  // settings are not available for user without edition membership
  if (!isSettingsEditionAllowedForUser({ memberships, memberId })) {
    return null;
  }

  const onClickSettings = () => {
    setIsItemSettingsOpen(!isItemSettingsOpen);
  };

  return (
    <IconButton
      onClick={onClickSettings}
      className={ITEM_SETTINGS_BUTTON_CLASS}
    >
      {isItemSettingsOpen ? <CloseIcon /> : <SettingsIcon />}
    </IconButton>
  );
}

ItemSettingsButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ItemSettingsButton;
