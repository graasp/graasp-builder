import { MouseEvent, useState } from 'react';

import { MoreVert } from '@mui/icons-material';
import { Divider, IconButton, Menu } from '@mui/material';

import {
  AccountType,
  ItemType,
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { ActionButton } from '@graasp/ui';

import { hooks } from '@/config/queryClient';
import { buildItemMenuId } from '@/config/selectors';

import BookmarkButton from '../common/BookmarkButton';
import CollapseButton from '../common/CollapseButton';
import DuplicateButton from '../common/DuplicateButton';
import FlagButton from '../common/FlagButton';
import HideButton from '../common/HideButton';
import PinButton from '../common/PinButton';
import RecycleButton from '../common/RecycleButton';
import useModalStatus from '../hooks/useModalStatus';
import CopyButton from '../item/copy/CopyButton';
import { CopyModal } from '../item/copy/CopyModal';
import EditButton from '../item/edit/EditButton';
import EditModal from '../item/edit/EditModal';
import MoveButton from '../item/move/MoveButton';
import { MoveModal } from '../item/move/MoveModal';
import ItemSettingsButton from '../item/settings/ItemSettingsButton';
import CreateShortcutButton from '../item/shortcut/CreateShortcutButton';
import CreateShortcutModal from '../item/shortcut/CreateShortcutModal';

type Props = {
  item: PackedItem;
};

/**
 * Menu of actions for item card
 */
const ItemMenuContent = ({ item }: Props): JSX.Element | null => {
  const { data: member } = hooks.useCurrentMember();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = (): void => {
    setAnchorEl(null);
  };
  const internalId = buildItemMenuId(item.id);

  const {
    isOpen: isCopyModalOpen,
    openModal: openCopyModal,
    closeModal: closeCopyModal,
  } = useModalStatus();
  const {
    isOpen: isMoveModalOpen,
    openModal: openMoveModal,
    closeModal: closeMoveModal,
  } = useModalStatus();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModalStatus();
  const {
    isOpen: isCreateShortcutOpen,
    openModal: openCreateShortcutModal,
    closeModal: closeCreateShortcutModal,
  } = useModalStatus();

  const canWrite =
    item.permission &&
    PermissionLevelCompare.gte(item.permission, PermissionLevel.Write);
  const canAdmin =
    item.permission &&
    PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin);

  if (!member) {
    return null;
  }

  const modificationMenus = [
    canWrite ? (
      <EditButton
        onClick={() => {
          openEditModal();
          closeMenu();
        }}
        key="edit"
        itemId={item.id}
        type={ActionButton.MENU_ITEM}
      />
    ) : (
      false
    ),
    member.type === AccountType.Individual ? (
      <CopyButton
        key="copy"
        type={ActionButton.MENU_ITEM}
        onClick={() => {
          openCopyModal();
          closeMenu();
        }}
      />
    ) : (
      false
    ),
    canWrite ? <DuplicateButton key="duplicate" item={item} /> : false,
    canAdmin ? (
      <MoveButton
        key="move"
        color="inherit"
        type={ActionButton.MENU_ITEM}
        onClick={() => {
          openMoveModal();
          closeMenu();
        }}
      />
    ) : (
      false
    ),
  ].filter(Boolean) as JSX.Element[];

  const visibilityMenus = [
    ...(canWrite
      ? [
          <HideButton key="hide" type={ActionButton.MENU_ITEM} item={item} />,
          <PinButton key="pin" type={ActionButton.MENU_ITEM} item={item} />,
        ]
      : []),

    canWrite && item.type !== ItemType.FOLDER ? (
      <CollapseButton
        key="collapse"
        type={ActionButton.MENU_ITEM}
        item={item}
      />
    ) : (
      false
    ),
  ].filter(Boolean) as JSX.Element[];

  const miscMenus = [
    ...(member.type === AccountType.Individual
      ? [
          <CreateShortcutButton
            key="shortcut"
            onClick={() => {
              openCreateShortcutModal();
              closeMenu();
            }}
          />,
          <BookmarkButton
            size="medium"
            key="bookmark"
            type={ActionButton.MENU_ITEM}
            item={item}
          />,
        ]
      : []),
    canWrite ? (
      <ItemSettingsButton
        key="settings"
        itemId={item.id}
        type={ActionButton.MENU_ITEM}
      />
    ) : (
      false
    ),
  ].filter(Boolean) as JSX.Element[];

  const destructiveMenus = [
    member?.id ? <FlagButton item={item} /> : false,
    canAdmin ? (
      <RecycleButton
        key="recycle"
        type={ActionButton.MENU_ITEM}
        itemIds={[item.id]}
        onClick={closeMenu}
      />
    ) : (
      false
    ),
  ].filter(Boolean) as JSX.Element[];

  // put all menus together and intersperse the dividers between the groups
  const menus = [
    modificationMenus,
    visibilityMenus,
    miscMenus,
    destructiveMenus,
  ]
    // remove empty arrays
    .filter((e) => e.length > 0)
    .flatMap((e) => [<Divider />, ...e])
    .slice(1);

  return (
    <>
      <CopyModal
        onClose={closeCopyModal}
        open={isCopyModalOpen}
        itemIds={[item.id]}
      />
      <MoveModal
        onClose={closeMoveModal}
        open={isMoveModalOpen}
        items={[item]}
      />
      <CreateShortcutModal
        onClose={closeCreateShortcutModal}
        item={item}
        open={isCreateShortcutOpen}
      />
      <EditModal onClose={closeEditModal} open={isEditModalOpen} item={item} />
      <IconButton
        aria-controls={open ? internalId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu id={internalId} anchorEl={anchorEl} open={open} onClose={closeMenu}>
        {menus.map((elem) => elem)}
      </Menu>
    </>
  );
};

export default ItemMenuContent;
