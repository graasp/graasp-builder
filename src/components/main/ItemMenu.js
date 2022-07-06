import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FlagIcon from '@material-ui/icons/Flag';
import { useTranslation } from 'react-i18next';
import {
  buildItemMenu,
  buildItemMenuButtonId,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
} from '../../config/selectors';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';
import MoveButton from '../common/MoveButton';
import CopyButton from './CopyButton';
import RecycleButton from '../common/RecycleButton';
import HideButton from '../common/HideButton';
import PinButton from '../common/PinButton';
import CollapseButton from '../common/CollapseButton';
import FavoriteButton from '../common/FavoriteButton';
import { BUTTON_TYPES } from '../../config/constants';
import { CurrentUserContext } from '../context/CurrentUserContext';

const ItemMenu = ({ item, canEdit }) => {
  const { data: member } = useContext(CurrentUserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );
  const { openModal: openFlagModal } = useContext(FlagItemModalContext);

  const handleClick = (event) => {
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
    openFlagModal(item.id);
    handleClose();
  };

  const renderEditorActions = () => {
    if (!canEdit) {
      return null;
    }
    return [
      <MoveButton
        type={BUTTON_TYPES.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
      <HideButton type={BUTTON_TYPES.MENU_ITEM} item={item} />,
      <PinButton type={BUTTON_TYPES.MENU_ITEM} item={item} />,
      <CollapseButton type={BUTTON_TYPES.MENU_ITEM} item={item} />,
      <RecycleButton
        type={BUTTON_TYPES.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
    ];
  };

  const renderAuthenticatedActions = () => {
    if (!member || member.isEmpty()) {
      return null;
    }
    return [
      <FavoriteButton type={BUTTON_TYPES.MENU_ITEM} item={item} />,
      <CopyButton
        type={BUTTON_TYPES.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
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
            {t('Create Shortcut')}
          </MenuItem>
          <MenuItem
            onClick={handleFlag}
            className={ITEM_MENU_FLAG_BUTTON_CLASS}
          >
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            {t('Flag')}
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

ItemMenu.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  canEdit: PropTypes.bool,
};

ItemMenu.defaultProps = {
  canEdit: false,
};

export default ItemMenu;
