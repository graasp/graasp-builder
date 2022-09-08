import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import { LayoutContext } from '../../context/LayoutContext';
import {
  buildSettingsButtonId,
  ITEM_SETTINGS_BUTTON_CLASS,
} from '../../../config/selectors';
import { ITEM_ACTION_TABS } from '../../../config/constants';

const ItemSettingsButton = ({ id }) => {
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);
  const { t } = useTranslation();

  const onClickSettings = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.SETTINGS
        ? null
        : ITEM_ACTION_TABS.SETTINGS,
    );
  };

  return (
    <Tooltip title={t('Settings')}>
      <IconButton
        onClick={onClickSettings}
        className={ITEM_SETTINGS_BUTTON_CLASS}
        id={buildSettingsButtonId(id)}
      >
        {openedActionTabId === ITEM_ACTION_TABS.SETTINGS ? (
          <CloseIcon />
        ) : (
          <SettingsIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

ItemSettingsButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ItemSettingsButton;
