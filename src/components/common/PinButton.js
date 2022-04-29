import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PushPinIcon from '@material-ui/icons/PushPin';
import PushPinOutlinedIcon from '@material-ui/icons/PushPinOutlined';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import { PIN_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUTTON_TYPES } from '../../config/constants';

const PinButton = ({ item, type, onClick }) => {
  const { t } = useTranslation();

  const editItem = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const [isPinned, setPinned] = useState(item?.settings?.isPinned);

  const handlePin = () => {
    setPinned(!isPinned);

    editItem.mutate({
      id: item.id,
      name: item.name,
      settings: {
        isPinned: !isPinned,
      },
    });
    onClick?.();
  };

  const icon = isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />;
  const text = isPinned ? t('Unpin') : t('Pin');

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handlePin}
          className={PIN_ITEM_BUTTON_CLASS}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {text}
        </MenuItem>
      );
    default:
    case BUTTON_TYPES.ICON_BUTTON:
      return (
        <Tooltip title={text}>
          <IconButton
            aria-label={text}
            className={PIN_ITEM_BUTTON_CLASS}
            onClick={handlePin}
          >
            {icon}
          </IconButton>
        </Tooltip>
      );
  }
};

PinButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    settings: PropTypes.shape({
      isPinned: PropTypes.bool,
    }),
  }),
  type: PropTypes.string,
  onClick: PropTypes.func,
};

PinButton.defaultProps = {
  item: {
    settings: {
      isPinned: false,
    },
  },
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default PinButton;
