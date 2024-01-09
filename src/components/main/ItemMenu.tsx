import { useContext, useState } from 'react';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import FlagIcon from '@mui/icons-material/Flag';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { DiscriminatedItem } from '@graasp/sdk';
import { ActionButton } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { getParentsIdsFromPath } from '@/utils/item';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
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
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';
import CopyButton from './CopyButton';

type Props = {
  item: DiscriminatedItem;
  canEdit?: boolean;
  canMove?: boolean;
};

const ItemMenu = ({
  item,
  canEdit = false,
  canMove = true,
}: Props): JSX.Element => {
  const { data: member } = useCurrentUserContext();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );
  const { openModal: openFlagModal } = useContext(FlagItemModalContext);
  const { mutate: copyItems } = mutations.useCopyItems();

  const handleClick: IconButtonProps['onClick'] = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
    handleClose();
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

    const newPayload = {
      ids: [item.id],
      to,
    };
    copyItems(newPayload);
  };
  const renderEditorActions = () => {
    if (!canEdit) {
      return null;
    }
    const result = canMove
      ? [
          <MoveButton
            key="move"
            type={ActionButton.MENU_ITEM}
            itemIds={[item.id]}
            onClick={handleClose}
          />,
        ]
      : [];
    return result.concat([
      <HideButton key="hide" type={ActionButton.MENU_ITEM} item={item} />,
      <PinButton key="pin" type={ActionButton.MENU_ITEM} item={item} />,
      <CollapseButton
        key="collapse"
        type={ActionButton.MENU_ITEM}
        item={item}
      />,
      <RecycleButton
        key="recycle"
        type={ActionButton.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
    ]);
  };

  const renderAuthenticatedActions = () => {
    if (!member || !member.id) {
      return null;
    }
    return [
      <FavoriteButton
        size="medium"
        key="favorite"
        type={ActionButton.MENU_ITEM}
        item={item}
      />,
      <CopyButton
        key="copy"
        type={ActionButton.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
      <MenuItem
        onClick={handleDuplicate}
        className={ITEM_MENU_DUPLICATE_BUTTON_CLASS}
      >
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        {translateBuilder(BUILDER.ITEM_MENU_DUPLICATE_MENU_ITEM)}
      </MenuItem>,
    ];
  };

  return (
    <>
      <IconButton
        id={buildItemMenuButtonId(item.id)}
        className={ITEM_MENU_BUTTON_CLASS}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      {Boolean(anchorEl) && (
        <Menu
          id={buildItemMenu(item.id)}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {renderAuthenticatedActions()}
          {renderEditorActions()}
          <MenuItem
            onClick={handleCreateShortcut}
            className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
          >
            <ListItemIcon>
              <LabelImportantIcon />
            </ListItemIcon>
            {translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
          </MenuItem>
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
      )}
    </>
  );
};

export default ItemMenu;
