import {
  CompleteMember,
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { ActionButton } from '@graasp/ui';

import BookmarkButton from '../common/BookmarkButton';
import CollapseButton from '../common/CollapseButton';
import DuplicateButton from '../common/DuplicateButton';
import EditButton from '../common/EditButton';
import FlagButton from '../common/FlagButton';
import HideButton from '../common/HideButton';
import MoveButton from '../common/MoveButton';
import PinButton from '../common/PinButton';
import RecycleButton from '../common/RecycleButton';
import ItemSettingsButton from '../item/settings/ItemSettingsButton';
import CopyButton from './CopyButton';
import CreateShortcutButton from './CreateShortcutButton';

type Props = {
  item: PackedItem;
  member?: CompleteMember | null;
};

const ItemMenuContent =
  ({ item, member }: Props) =>
  (closeMenu: () => void): JSX.Element[] => {
    const canWrite =
      item.permission &&
      PermissionLevelCompare.gte(item.permission, PermissionLevel.Write);
    const canAdmin =
      item.permission &&
      PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin);

    const renderEditorActions = () => {
      if (canWrite) {
        return [
          <EditButton key="edit" item={item} type={ActionButton.MENU_ITEM} />,
          <ItemSettingsButton
            key="settings"
            itemId={item.id}
            type={ActionButton.MENU_ITEM}
          />,
          canAdmin ? (
            <MoveButton
              key="move"
              type={ActionButton.MENU_ITEM}
              itemIds={[item.id]}
              onClick={closeMenu}
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
              onClick={closeMenu}
            />
          ) : undefined,
        ].filter(Boolean) as JSX.Element[];
      }
      return [];
    };

    if (member?.id) {
      return [
        <CopyButton
          key="copy"
          type={ActionButton.MENU_ITEM}
          itemIds={[item.id]}
          onClick={closeMenu}
        />,
        <DuplicateButton key="duplicate" item={item} />,
        <CreateShortcutButton key="shortcut" item={item} />,
        <BookmarkButton
          size="medium"
          key="bookmark"
          type={ActionButton.MENU_ITEM}
          item={item}
        />,
        ...renderEditorActions(),
        <FlagButton item={item} />,
      ];
    }
    return [];
  };

export default ItemMenuContent;
