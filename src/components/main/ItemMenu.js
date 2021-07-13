import { MUTATION_KEYS } from '@graasp/query-client';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '../../config/queryClient';
import {
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_FAVORITE_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
} from '../../config/selectors';
import { isItemFavorite } from '../../utils/item';
import { CopyItemModalContext } from '../context/CopyItemModalContext';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { MoveItemModalContext } from '../context/MoveItemModalContext';

const ItemMenu = ({ item, member }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
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
  member: PropTypes.instanceOf(Map).isRequired,
};

export default ItemMenu;
