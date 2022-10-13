import PropTypes from 'prop-types';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { BUTTON_TYPES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_RECYCLE_BUTTON_CLASS,
} from '../../config/selectors';

const RecycleButton = ({ itemIds, color, id, type, onClick }) => {
  const { t } = useBuilderTranslation();
  const { mutate: recycleItems } = useMutation(MUTATION_KEYS.RECYCLE_ITEMS);

  const handleClick = () => {
    recycleItems(itemIds);
    onClick?.();
  };

  const text = t(BUILDER.RECYCLE_ITEM_BUTTON);

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handleClick}
          className={ITEM_MENU_RECYCLE_BUTTON_CLASS}
        >
          <ListItemIcon>
            <DeleteIcon />
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
            className={ITEM_RECYCLE_BUTTON_CLASS}
            aria-label={text}
            onClick={handleClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      );
  }
};

RecycleButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

RecycleButton.defaultProps = {
  color: 'default',
  id: '',
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default RecycleButton;
