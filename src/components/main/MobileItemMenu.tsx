import { useContext } from 'react';

import FlagIcon from '@mui/icons-material/Flag';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { Divider } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

import { DiscriminatedItem } from '@graasp/sdk';
import { ActionButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
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
  children: JSX.Element;
};

const MobileItemMenu = ({
  item,
  canEdit = false,
  canMove = true,
  children,
}: Props): JSX.Element => {
  const { data: member } = useCurrentUserContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );
  const { openModal: openFlagModal } = useContext(FlagItemModalContext);

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
  };

  const handleFlag = () => {
    openFlagModal?.(item.id);
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
          />,
        ]
      : [];
    return result.concat([
      <HideButton key="hide" type={ActionButton.MENU_ITEM} item={item} />,
      <CollapseButton
        key="collapse"
        type={ActionButton.MENU_ITEM}
        item={item}
      />,
      <PinButton key="pin" type={ActionButton.MENU_ITEM} item={item} />,
    ]);
  };

  const renderAuthenticatedActions = () => {
    if (!member || !member.id) {
      return null;
    }
    return [
      <CopyButton
        key="copy"
        type={ActionButton.MENU_ITEM}
        itemIds={[item.id]}
      />,
      <FavoriteButton
        size="medium"
        key="favorite"
        type={ActionButton.MENU_ITEM}
        item={item}
      />,
    ];
  };

  return (
    <>
      {renderAuthenticatedActions()}
      <Divider />
      {children}
      <Divider />
      <MenuItem
        onClick={handleCreateShortcut}
        className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
        sx={{ paddingY: '2px' }}
      >
        <ListItemIcon>
          <LabelImportantIcon />
        </ListItemIcon>
        {translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
      </MenuItem>
      {renderEditorActions()}
      <Divider />
      {canEdit && (
        <RecycleButton
          key="recycle"
          type={ActionButton.MENU_ITEM}
          itemIds={[item.id]}
        />
      )}
      <MenuItem
        onClick={handleFlag}
        className={ITEM_MENU_FLAG_BUTTON_CLASS}
        sx={{ paddingY: '2px' }}
      >
        <ListItemIcon>
          <FlagIcon />
        </ListItemIcon>
        {translateBuilder(BUILDER.ITEM_MENU_FLAG_MENU_ITEM)}
      </MenuItem>
    </>
  );
};

export default MobileItemMenu;
