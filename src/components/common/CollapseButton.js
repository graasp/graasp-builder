import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import { COLLAPSE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUTTON_TYPES } from '../../config/constants';

const CollapseButton = ({ item, type, onClick }) => {
  const { t } = useTranslation();

  const editItem = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const [isCollapsible, setIsCollapsible] = useState(item?.settings?.isCollapsible);

  const handleCollapse = () => {
    setIsCollapsible(!isCollapsible);

    editItem.mutate({
      id: item.id,
      name: item.name,
      settings: {
        isCollapsible: !isCollapsible,
      },
    });
    onClick?.();
  };

  const icon = isCollapsible ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  const text = isCollapsible ? t('Uncollapse') : t('Collapse');

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handleCollapse}
          className={COLLAPSE_ITEM_BUTTON_CLASS}
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
            className={COLLAPSE_ITEM_BUTTON_CLASS}
            onClick={handleCollapse}
          >
            {icon}
          </IconButton>
        </Tooltip>
      );
  }
};

CollapseButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    settings: PropTypes.shape({
      isCollapsible: PropTypes.bool,
    }),
  }),
  type: PropTypes.string,
  onClick: PropTypes.func,
};

CollapseButton.defaultProps = {
  item: {
    settings: {
      isCollapsible: false,
    },
  },
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default CollapseButton;
