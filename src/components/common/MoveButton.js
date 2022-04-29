import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { OpenWith } from '@material-ui/icons';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MOVE_BUTTON_CLASS,
} from '../../config/selectors';
import { MoveItemModalContext } from '../context/MoveItemModalContext';
import { BUTTON_TYPES } from '../../config/constants';

const MoveButton = ({ itemIds, color, id, type, onClick }) => {
  const { t } = useTranslation();

  const { openModal: openMoveModal } = useContext(MoveItemModalContext);

  const handleMove = () => {
    openMoveModal(itemIds);
    onClick?.();
  };

  const text = t('Move');

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handleMove}
          className={ITEM_MENU_MOVE_BUTTON_CLASS}
        >
          <ListItemIcon>
            <OpenWith />
          </ListItemIcon>
          {text}
        </MenuItem>
      );
    default:
    case BUTTON_TYPES.ICON_BUTTON:
      return (
        <Tooltip title={text}>
          <IconButton
            id={id}
            color={color}
            className={ITEM_MOVE_BUTTON_CLASS}
            aria-label={text}
            onClick={handleMove}
          >
            <OpenWith />
          </IconButton>
        </Tooltip>
      );
  }
};

MoveButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

MoveButton.defaultProps = {
  color: 'default',
  id: '',
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default MoveButton;
