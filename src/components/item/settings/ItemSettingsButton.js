import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';

import { BUILDER } from '@graasp/translations';

import { ITEM_ACTION_TABS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  buildSettingsButtonId,
} from '../../../config/selectors';
import { LayoutContext } from '../../context/LayoutContext';

const ItemSettingsButton = ({ id }) => {
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);
  const { t } = useBuilderTranslation();

  const onClickSettings = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.SETTINGS
        ? null
        : ITEM_ACTION_TABS.SETTINGS,
    );
  };

  return (
    <Tooltip title={t(BUILDER.SETTINGS_TITLE)}>
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
