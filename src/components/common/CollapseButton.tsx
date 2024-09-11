import { useEffect, useState } from 'react';

import { IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { ChevronsDownUpIcon, ChevronsUpDownIcon } from 'lucide-react';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { COLLAPSE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  item: DiscriminatedItem;
  type?: ActionButtonVariant;
  onClick?: () => void;
  isCollapsedTextKey?: string;
  notCollapsedTextKey?: string;
};

const CollapseButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
  onClick,
  isCollapsedTextKey = BUILDER.COLLAPSE_ITEM_UNCOLLAPSE_TEXT,
  notCollapsedTextKey = BUILDER.COLLAPSE_ITEM_COLLAPSE_TEXT,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = mutations.useEditItem();
  const [isCollapsible, setIsCollapsible] = useState(
    item?.settings?.isCollapsible ?? false,
  );

  useEffect(() => {
    setIsCollapsible(item?.settings?.isCollapsible ?? false);
  }, [item]);

  const disabled = item.type === ItemType.FOLDER;

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

  const icon = isCollapsible ? <ChevronsUpDownIcon /> : <ChevronsDownUpIcon />;
  let text;
  if (disabled) {
    text = translateBuilder(BUILDER.SETTINGS_COLLAPSE_FOLDER_INFORMATION);
  } else {
    text = translateBuilder(
      isCollapsible ? isCollapsedTextKey : notCollapsedTextKey,
    );
  }

  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handleCollapse}
          className={COLLAPSE_ITEM_BUTTON_CLASS}
          disabled={disabled}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {text}
        </MenuItem>
      );
    case ActionButton.ICON:
      return icon;
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={text}>
          <span>
            <IconButton
              disabled={disabled}
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
