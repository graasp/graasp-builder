import { Link } from 'react-router-dom';

import { IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';

import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { SettingsIcon } from 'lucide-react';

import { buildItemSettingsPath } from '@/config/paths';

import { useBuilderTranslation } from '../../../config/i18n';
import { buildSettingsButtonId } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  itemId: string;
  type?: ActionButtonVariant;
};

const ItemSettingsButton = ({
  itemId,
  type = ActionButton.ICON_BUTTON,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const text = translateBuilder(BUILDER.SETTINGS_TITLE);
  const to = buildItemSettingsPath(itemId);
  const id = buildSettingsButtonId(itemId);

  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem component={Link} to={to} key={text} id={id}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {text}
        </MenuItem>
      );
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={text}>
          <IconButton id={id} component={Link} to={to}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      );
  }
};

export default ItemSettingsButton;
