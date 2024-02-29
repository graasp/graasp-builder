import { useContext, useState } from 'react';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  IconButtonProps,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { ActionButton } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import { getParentsIdsFromPath } from '@/utils/item';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CollapseButton from '../common/CollapseButton';
import FavoriteButton from '../common/FavoriteButton';
import HideButton from '../common/HideButton';
import MoveButton from '../common/MoveButton';
import PinButton from '../common/PinButton';
import RecycleButton from '../common/RecycleButton';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';
import CopyButton from './CopyButton';
import CreateShortcutButton from './CreateShortcutButton';

type Props = {
  item: DiscriminatedItem;
  canWrite?: boolean;
  canAdmin?: boolean;
  canMove?: boolean;
};

const ItemMenu = ({
  item,
  canWrite = false,
  canAdmin = false,
  canMove = true,
}: Props): JSX.Element | null => {
  const { data: member } = useCurrentUserContext();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal: openFlagModal } = useContext(FlagItemModalContext);
  const { mutate: copyItems } = mutations.useCopyItems();
  const { data: memberships } = hooks.useItemMemberships(item.id);

  const handleClick: IconButtonProps['onClick'] = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFlag = () => {
    openFlagModal?.(item.id);
    handleClose();
  };

  const handleDuplicate = () => {
    const parentsIds = getParentsIdsFromPath(item.path);
    // get the close parent if not then undefined
    const to =
      parentsIds.length > 1 ? parentsIds[parentsIds.length - 2] : undefined;

    copyItems({
      ids: [item.id],
      to,
    });
  };
  const renderEditorActions = () => {
    if (canWrite) {
      return [
        canMove ? (
          <MoveButton
            key="move"
            type={ActionButton.MENU_ITEM}
            itemIds={[item.id]}
            onClick={handleClose}
          />
        ) : undefined,
        <HideButton key="hide" type={ActionButton.MENU_ITEM} item={item} />,
        <PinButton key="pin" type={ActionButton.MENU_ITEM} item={item} />,
        <CollapseButton
          key="collapse"
          type={ActionButton.MENU_ITEM}
          item={item}
        />,
        canAdmin ? (
          <RecycleButton
            key="recycle"
            type={ActionButton.MENU_ITEM}
            itemIds={[item.id]}
            onClick={handleClose}
          />
        ) : undefined,
      ].filter(Boolean);
    }
    return null;
  };

  if (memberships && member?.id) {
    return (
      <>
        <IconButton
          id={buildItemMenuButtonId(item.id)}
          className={ITEM_MENU_BUTTON_CLASS}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id={buildItemMenu(item.id)}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <CopyButton
            key="copy"
            type={ActionButton.MENU_ITEM}
            itemIds={[item.id]}
            onClick={handleClose}
          />
          <MenuItem
            onClick={handleDuplicate}
            key="duplicate"
            className={ITEM_MENU_DUPLICATE_BUTTON_CLASS}
          >
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            {translateBuilder(BUILDER.ITEM_MENU_DUPLICATE_MENU_ITEM)}
          </MenuItem>
          <CreateShortcutButton
            key="shortcut"
            item={item}
            onClick={handleClose}
          />
          <FavoriteButton
            size="medium"
            key="favorite"
            type={ActionButton.MENU_ITEM}
            item={item}
          />
          {renderEditorActions()}
          <MenuItem
            onClick={handleFlag}
            className={ITEM_MENU_FLAG_BUTTON_CLASS}
          >
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            {translateBuilder(BUILDER.ITEM_MENU_FLAG_MENU_ITEM)}
          </MenuItem>
        </Menu>
      </>
    );
  }
  return null;
};

export default ItemMenu;
