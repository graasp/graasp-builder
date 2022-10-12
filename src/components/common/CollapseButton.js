import PropTypes from 'prop-types';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { BUTTON_TYPES } from '../../config/constants';
import { useMutation } from '../../config/queryClient';
import { COLLAPSE_ITEM_BUTTON_CLASS } from '../../config/selectors';

const CollapseButton = ({ item, type, onClick }) => {
  const { t } = useTranslation();

  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const [isCollapsible, setIsCollapsible] = useState(
    item?.settings?.isCollapsible,
  );

  useEffect(() => {
    setIsCollapsible(item?.settings?.isCollapsible);
  }, [item]);

  const handleCollapse = () => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        isCollapsible: !isCollapsible,
      },
    });
    onClick?.();
  };

  const icon = isCollapsible ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  const text = isCollapsible
    ? t(BUILDER.COLLAPSE_ITEM_UNCOLLAPSE_TEXT)
    : t(BUILDER.COLLAPSE_ITEM_COLLAPSE_TEXT);

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
