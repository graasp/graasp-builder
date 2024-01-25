import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { ListItemIcon, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  buildSettingsButtonId,
} from '../../../config/selectors';
import { ItemActionTabs } from '../../../enums';
import { BUILDER } from '../../../langs/constants';
import { useLayoutContext } from '../../context/LayoutContext';

type Props = {
  id: string;
  type?: ActionButtonVariant;
  title?: string;
  onClick?: () => void;
};

const ItemSettingsButton = ({
  id,
  type = 'icon',
  title = 'Settings',
  onClick,
}: Props): JSX.Element => {
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();
  const { t: translateBuilder } = useBuilderTranslation();

  const onClickSettings = () => {
    setOpenedActionTabId(
      openedActionTabId === ItemActionTabs.Settings
        ? null
        : ItemActionTabs.Settings,
    );
    onClick?.();
  };

  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem key={title} onClick={onClickSettings}>
          <ListItemIcon>
            {openedActionTabId === ItemActionTabs.Settings ? (
              <CloseIcon />
            ) : (
              <SettingsIcon />
            )}
          </ListItemIcon>
          {title}
        </MenuItem>
      );
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={translateBuilder(BUILDER.SETTINGS_TITLE)}>
          <span>
            <IconButton
              onClick={onClickSettings}
              className={ITEM_SETTINGS_BUTTON_CLASS}
              id={buildSettingsButtonId(id)}
            >
              {openedActionTabId === ItemActionTabs.Settings ? (
                <CloseIcon />
              ) : (
                <SettingsIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default ItemSettingsButton;
