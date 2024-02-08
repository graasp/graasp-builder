import { useEffect, useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';

import { Item } from '@graasp/sdk';
import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { COLLAPSE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  item: Item;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const CollapseButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = mutations.useEditItem();
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

  const icon = isCollapsible ? <ExpandLess /> : <ExpandMore />;
  const text = isCollapsible
    ? translateBuilder(BUILDER.COLLAPSE_ITEM_UNCOLLAPSE_TEXT)
    : translateBuilder(BUILDER.COLLAPSE_ITEM_COLLAPSE_TEXT);

  switch (type) {
    case ActionButton.MENU_ITEM:
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
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={text}>
          <span>
            <IconButton
              aria-label={text}
              className={COLLAPSE_ITEM_BUTTON_CLASS}
              onClick={handleCollapse}
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default CollapseButton;
