import { Link } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import { ListItemIcon, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { buildItemSettingsPath } from '@/config/paths';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  buildSettingsButtonId,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  id: string;
  type?: ActionButtonVariant;
  title?: string;
};

const ItemSettingsButton = ({
  id,
  type = 'icon',
  title = 'Settings',
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem
          key={title}
          className={ITEM_SETTINGS_BUTTON_CLASS}
          component={Link}
          id={buildSettingsButtonId(id)}
          to={buildItemSettingsPath(id)}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {title}
        </MenuItem>
      );
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={translateBuilder(BUILDER.SETTINGS_TITLE)}>
          <IconButton
            to={buildItemSettingsPath(id)}
            className={ITEM_SETTINGS_BUTTON_CLASS}
            component={Link}
            id={buildSettingsButtonId(id)}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      );
  }
};

export default ItemSettingsButton;
