import { RecordOf } from 'immutable';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { FC, useEffect, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { ButtonType } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { COLLAPSE_ITEM_BUTTON_CLASS } from '../../config/selectors';

type Props = {
  item: RecordOf<Item>;
  type?: ButtonType;
  onClick?: () => void;
};

const CollapseButton: FC<Props> = ({
  item,
  type = ButtonType.ICON_BUTTON,
  onClick,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = useMutation<unknown, unknown, Partial<Item>>(
    MUTATION_KEYS.EDIT_ITEM,
  );
  const [isCollapsible, setIsCollapsible] = useState(
    item?.settings?.isCollapsible ?? false,
  );

  useEffect(() => {
    setIsCollapsible(item?.settings?.isCollapsible ?? false);
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
    ? translateBuilder(BUILDER.COLLAPSE_ITEM_UNCOLLAPSE_TEXT)
    : translateBuilder(BUILDER.COLLAPSE_ITEM_COLLAPSE_TEXT);

  switch (type) {
    case ButtonType.MENU_ITEM:
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
    case ButtonType.ICON_BUTTON:
    default:
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

export default CollapseButton;
