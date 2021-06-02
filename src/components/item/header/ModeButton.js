import React, { useContext } from 'react';
import ListIcon from '@material-ui/icons/List';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import IconButton from '@material-ui/core/IconButton';
import { ITEM_LAYOUT_MODES } from '../../../config/enum';
import {
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../../config/selectors';
import { ItemLayoutModeContext } from '../../context/ItemLayoutModeContext';

const ModeButton = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useContext(ItemLayoutModeContext);

  const handleOnClick = (value) => {
    setMode(value);
  };

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <div>
          <Tooltip title={t('View as List')}>
            <span>
              <IconButton
                id={MODE_LIST_BUTTON_ID}
                onClick={() => {
                  handleOnClick(ITEM_LAYOUT_MODES.LIST);
                }}
                color="primary"
              >
                <ListIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    case ITEM_LAYOUT_MODES.LIST:
      return (
        <div>
          <Tooltip title={t('View as Card')}>
            <span>
              <IconButton
                id={MODE_GRID_BUTTON_ID}
                color="primary"
                onClick={() => {
                  handleOnClick(ITEM_LAYOUT_MODES.GRID);
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    default:
      return null;
  }
};

export default ModeButton;
