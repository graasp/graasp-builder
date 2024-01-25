import CloseIcon from '@mui/icons-material/Close';
import { ListItemIcon, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ActionButton, ActionButtonVariant, LibraryIcon } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { ItemActionTabs } from '../../enums';
import { BUILDER } from '../../langs/constants';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const PublishButton = ({
  itemId,
  type = 'icon',
  onClick: handleClose,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ItemActionTabs.Library
        ? null
        : ItemActionTabs.Library,
    );
    handleClose?.();
  };

  const title = translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE);

  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem
          key={title}
          onClick={onClick}
          className={PUBLISH_ITEM_BUTTON_CLASS}
          id={buildPublishButtonId(itemId)}
        >
          <ListItemIcon>
            {openedActionTabId === ItemActionTabs.Library ? (
              <CloseIcon />
            ) : (
              <LibraryIcon size={24} showSetting primaryColor="#777" />
            )}
          </ListItemIcon>
          {title}
        </MenuItem>
      );
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={title}>
          <span>
            <IconButton
              aria-label={title}
              onClick={onClick}
              className={PUBLISH_ITEM_BUTTON_CLASS}
              id={buildPublishButtonId(itemId)}
            >
              {openedActionTabId === ItemActionTabs.Library ? (
                <CloseIcon />
              ) : (
                <LibraryIcon size={24} showSetting primaryColor="#777" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default PublishButton;
