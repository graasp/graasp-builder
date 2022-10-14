import ListIcon from '@mui/icons-material/List';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../../config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../enums';
import { LayoutContext } from '../../context/LayoutContext';

const ModeButton = () => {
  const { t } = useBuilderTranslation();
  const { mode, setMode } = useContext(LayoutContext);

  const handleOnClick = (value) => {
    setMode(value);
  };

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <div>
          <Tooltip title={t(BUILDER.LAYOUT_MODE_LIST_LABEL)}>
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
          <Tooltip title={t(BUILDER.LAYOUT_MODE_GRID_LABEL)}>
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
