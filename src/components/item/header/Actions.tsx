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

import useModalStatus from '@/components/hooks/useModalStatus';
import { hooks } from '@/config/queryClient';
import { ITEM_MENU_BOOKMARK_BUTTON_CLASS } from '@/config/selectors';

import BookmarkButton from '../../common/BookmarkButton';
import CollapseButton from '../../common/CollapseButton';
import FlagButton from '../../common/FlagButton';
import HideButton from '../../common/HideButton';
import PinButton from '../../common/PinButton';
import RecycleButton from '../../common/RecycleButton';
import CreateShortcutButton from '../shortcut/CreateShortcutButton';
import CreateShortcutModal from '../shortcut/CreateShortcutModal';

type Props = {
  item: PackedItem;
};

const internalId = 'menu';

/**
 * Menu of actions for item header
 * contains less actions since some of them are outside
 * or does not make sense in the context of the item
 */
const Actions = ({ item }: Props): JSX.Element | null => {
  const { data: member } = hooks.useCurrentMember();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = (): void => {
    setAnchorEl(null);
  };
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

  if (!member?.id) {
    return null;
  }

  return (
    <>
      <CreateShortcutModal
        item={item}
        onClose={closeCreateShortcutModal}
        open={isCreateShortcutOpen}
      />
      <IconButton
        aria-controls={open ? internalId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu id={internalId} anchorEl={anchorEl} open={open} onClose={closeMenu}>
        {member.type === AccountType.Individual ? (
          <>
            <CreateShortcutButton
              key="shortcut"
              onClick={() => {
                openCreateShortcutModal();
                closeMenu();
              }}
            />
            <BookmarkButton
              size="medium"
              key="bookmark"
              type={ActionButton.MENU_ITEM}
              item={item}
              className={ITEM_MENU_BOOKMARK_BUTTON_CLASS}
            />
            {canWrite && (
              <>
                <Divider />
                <HideButton
                  key="hide"
                  type={ActionButton.MENU_ITEM}
                  item={item}
                />
                <PinButton
                  key="pin"
                  type={ActionButton.MENU_ITEM}
                  item={item}
                />
                {item.type !== ItemType.FOLDER && (
                  <CollapseButton
                    key="collapse"
                    type={ActionButton.MENU_ITEM}
                    item={item}
                  />
                )}
              </>
            )}
            <Divider />
          </>
        ) : null}
        <FlagButton item={item} />
        {canAdmin && (
          <RecycleButton
            key="recycle"
            type={ActionButton.MENU_ITEM}
            itemIds={[item.id]}
            onClick={closeMenu}
          />
        )}
      </Menu>
    </>
  );
};

export default Actions;
