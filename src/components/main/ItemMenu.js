import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { MUTATION_KEYS } from '@graasp/query-client';
import {
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_FAVORITE_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
} from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';
import { MoveItemModalContext } from '../context/MoveItemModalContext';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { hooks, useMutation } from '../../config/queryClient';
import { isItemFavorite } from '../../utils/item';

const { useCurrentMember } = hooks;

const ItemMenu = ({ item }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const { data: member } = useCurrentMember();
  const { openModal: openCopyModal } = useContext(CopyItemModalContext);
  const { openModal: openMoveModal } = useContext(MoveItemModalContext);
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );

  const mutation = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = () => {
    openMoveModal(item.id);
    handleClose();
  };

  const handleCopy = () => {
    openCopyModal(item.id);
    handleClose();
  };

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
    handleClose();
  };

  const handleFavorite = () => {
    mutation.mutate({
      id: member.get('id'),
      extra: {
        favoriteItems: member?.get('extra').favoriteItems
          ? member.get('extra').favoriteItems.concat([item.id])
          : [item.id],
      },
    });
    handleClose();
  };

  const handleUnfavorite = () => {
    mutation.mutate({
      id: member.get('id'),
      extra: {
        favoriteItems: member
          ?.get('extra')
          .favoriteItems?.filter((id) => id !== item.id),
      },
    });
    handleClose();
  };

  return (
    <>
      <IconButton className={ITEM_MENU_BUTTON_CLASS} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={buildItemMenu(item.id)}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleMove} className={ITEM_MENU_MOVE_BUTTON_CLASS}>
          {t('Move')}
        </MenuItem>
        <MenuItem onClick={handleCopy} className={ITEM_MENU_COPY_BUTTON_CLASS}>
          {t('Copy')}
        </MenuItem>
        <MenuItem
          onClick={handleCreateShortcut}
          className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
        >
          {t('Create Shortcut')}
        </MenuItem>
        <MenuItem
          onClick={
            isItemFavorite(item, member) ? handleUnfavorite : handleFavorite
          }
          className={ITEM_MENU_FAVORITE_BUTTON_CLASS}
        >
          {isItemFavorite(item, member)
            ? t('Remove from Favorites')
            : t('Add to Favorites')}
        </MenuItem>
      </Menu>
    </>
  );
};

ItemMenu.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export default ItemMenu;
