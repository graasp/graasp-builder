import { IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';

import { ItemVisibilityType, PackedItem } from '@graasp/sdk';
import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import {
  HIDDEN_ITEM_BUTTON_CLASS,
  buildHideButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type HideButtonProps = {
  item: PackedItem;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const HideButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: HideButtonProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const postVisibility = mutations.usePostItemVisibility();
  const deleteVisibility = mutations.useDeleteItemVisibility();

  const hiddenVisibility = item.hidden;
  // since children items are hidden because parent is hidden, the hidden tag should be removed from the root item
  // if hiddenVisibility is undefined -> the item is not hidden
  const isOriginalHiddenItem =
    !hiddenVisibility || hiddenVisibility?.item?.path === item.path;

  const handleToggleHide = () => {
    if (hiddenVisibility) {
      deleteVisibility.mutate({
        itemId: item.id,
        type: ItemVisibilityType.Hidden,
      });
    } else {
      postVisibility.mutate({
        itemId: item.id,
        type: ItemVisibilityType.Hidden,
      });
    }
    onClick?.();
  };

  const text = hiddenVisibility
    ? translateBuilder(BUILDER.HIDE_ITEM_SHOW_TEXT)
    : translateBuilder(BUILDER.HIDE_ITEM_HIDE_TEXT);
  let tooltip = text;
  if (hiddenVisibility && !isOriginalHiddenItem) {
    tooltip = translateBuilder(BUILDER.HIDE_ITEM_HIDDEN_PARENT_INFORMATION);
  }

  const icon = hiddenVisibility ? <EyeIcon /> : <EyeOffIcon />;

  switch (type) {
    case ActionButton.MENU_ITEM: {
      const menuItem = (
        <MenuItem
          key={text}
          onClick={handleToggleHide}
          className={HIDDEN_ITEM_BUTTON_CLASS}
          disabled={!isOriginalHiddenItem}
          data-cy={buildHideButtonId(Boolean(hiddenVisibility))}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {text}
        </MenuItem>
      );

      // show tooltip only on disabled
      if (isOriginalHiddenItem) {
        return menuItem;
      }
      return (
        <Tooltip title={tooltip} placement="left">
          <span>{menuItem}</span>
        </Tooltip>
      );
    }
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={tooltip}>
          <span>
            <IconButton
              aria-label={text}
              className={HIDDEN_ITEM_BUTTON_CLASS}
              onClick={handleToggleHide}
              disabled={!isOriginalHiddenItem}
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default HideButton;
