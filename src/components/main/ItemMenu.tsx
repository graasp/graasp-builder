import { FC, useContext } from 'react';

import { DiscriminatedItem, convertJs } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import {
  ActionButton,
  ItemMenu as GraaspItemMenu,
  ShortcutButton as GraaspShortcutButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../config/selectors';
import CollapseButton from '../common/CollapseButton';
import FavoriteButton from '../common/FavoriteButton';
import FlagButton from '../common/FlagButton';
import HideButton from '../common/HideButton';
import MoveButton from '../common/MoveButton';
import PinButton from '../common/PinButton';
import RecycleButton from '../common/RecycleButton';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import CopyButton from './CopyButton';

type Props = {
  item: DiscriminatedItem;
  canEdit?: boolean;
};

const ItemMenu: FC<Props> = ({ item, canEdit = false }) => {
  const { data: member } = useCurrentUserContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );

  const handleClose = () => {
    // eslint-disable-next-line
    console.log('hej');
  };

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
  };

  const renderEditorActions = () => {
    if (!canEdit) {
      return null;
    }
    return (
      <>
        <MoveButton
          key="move"
          type={ActionButton.MENU_ITEM}
          itemIds={[item.id]}
          onClick={handleClose}
        />
        <HideButton key="hide" type={ActionButton.MENU_ITEM} item={item} />
        <PinButton key="pin" type={ActionButton.MENU_ITEM} item={item} />
        <CollapseButton
          key="collapse"
          type={ActionButton.MENU_ITEM}
          item={item}
        />
        <RecycleButton
          key="recycle"
          type={ActionButton.MENU_ITEM}
          itemIds={[item.id]}
          onClick={handleClose}
        />
      </>
    );
  };

  const renderAuthenticatedActions = () => {
    if (!member || !member.id) {
      return null;
    }
    return (
      <>
        <FavoriteButton
          size="medium"
          key="favorite"
          type={ActionButton.MENU_ITEM}
          item={convertJs(item)}
        />
        <CopyButton
          key="copy"
          type={ActionButton.MENU_ITEM}
          itemIds={[item.id]}
        />
      </>
    );
  };

  const renderDefaultActions = () => (
    <>
      <GraaspShortcutButton
        key="shortcut"
        onClick={handleCreateShortcut}
        type={ActionButton.MENU_ITEM}
        menuItemClassName={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
        text={translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
      />
      <FlagButton key="flag" type={ActionButton.MENU_ITEM} itemId={item.id} />
    </>
  );

  return (
    <GraaspItemMenu
      menuButtonId={buildItemMenuButtonId(item.id)}
      menuButtonClassName={ITEM_MENU_BUTTON_CLASS}
      menuId={buildItemMenu(item.id)}
    >
      {renderAuthenticatedActions()}
      {renderEditorActions()}
      {renderDefaultActions()}
    </GraaspItemMenu>
  );
};

export default ItemMenu;
