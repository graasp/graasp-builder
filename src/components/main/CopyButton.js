import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { FilterNone } from '@material-ui/icons';
import {
  ITEM_COPY_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';
import { BUTTON_TYPES } from '../../config/constants';

const CopyButton = ({ itemIds, color, id, type, onClick }) => {
  const { t } = useTranslation();

  const { openModal: openCopyModal } = useContext(CopyItemModalContext);

  const handleCopy = () => {
    openCopyModal(itemIds);
    onClick?.();
  };

  const text = t('Copy');

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handleCopy}
          className={ITEM_MENU_COPY_BUTTON_CLASS}
        >
          <ListItemIcon>
            <FilterNone />
          </ListItemIcon>
          {text}
        </MenuItem>
      );
    default:
      return (
        <Tooltip title={text}>
          <IconButton
            id={id}
            color={color}
            className={ITEM_COPY_BUTTON_CLASS}
            aria-label={text}
            onClick={handleCopy}
          >
            <FilterNone />
          </IconButton>
        </Tooltip>
      );
  }
};

CopyButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

CopyButton.defaultProps = {
  color: 'default',
  id: '',
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default CopyButton;
