import { Link } from 'react-router-dom';

import { ListItemIcon, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ActionButton, ActionButtonVariant, LibraryIcon } from '@graasp/ui';

import { buildItemPublishPath } from '@/config/paths';

import { useBuilderTranslation } from '../../config/i18n';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemId: string;
  type?: ActionButtonVariant;
};

const PublishButton = ({
  itemId,
  type = ActionButton.ICON_BUTTON,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const title = translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE);

  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem
          key={title}
          className={PUBLISH_ITEM_BUTTON_CLASS}
          id={buildPublishButtonId(itemId)}
          component={Link}
          to={buildItemPublishPath(itemId)}
        >
          <ListItemIcon>
            <LibraryIcon size={24} showSetting primaryColor="#777" />
          </ListItemIcon>
          {title}
        </MenuItem>
      );
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={title}>
          <IconButton
            aria-label={title}
            className={PUBLISH_ITEM_BUTTON_CLASS}
            id={buildPublishButtonId(itemId)}
            to={buildItemPublishPath(itemId)}
            component={Link}
          >
            <LibraryIcon size={24} showSetting primaryColor="#777" />
          </IconButton>
        </Tooltip>
      );
  }
};

export default PublishButton;
