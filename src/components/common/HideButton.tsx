import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { Item, ItemTagType } from '@graasp/sdk';
import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, mutations } from '../../config/queryClient';
import {
  HIDDEN_ITEM_BUTTON_CLASS,
  buildHideButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  item: Item;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const HideButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data: tags } = hooks.useItemTags(item.id);
  const postTag = mutations.usePostItemTag();
  const deleteTag = mutations.useDeleteItemTag();

  const hiddenTag = tags?.filter(
    ({ type: tagType }) => tagType === ItemTagType.Hidden,
  )?.[0];
  // since children items are hidden because parent is hidden, the hidden tag should be removed from the root item
  // if hiddenTag is undefined -> the item is not hidden
  const isOriginalHiddenItem =
    !hiddenTag || hiddenTag?.item?.path === item.path;

  const handleToggleHide = () => {
    if (hiddenTag) {
      deleteTag.mutate({
        itemId: item.id,
        type: ItemTagType.Hidden,
      });
    } else {
      postTag.mutate({
        itemId: item.id,
        type: ItemTagType.Hidden,
      });
    }
    onClick?.();
  };

  const text = hiddenTag
    ? translateBuilder(BUILDER.HIDE_ITEM_SHOW_TEXT)
    : translateBuilder(BUILDER.HIDE_ITEM_HIDE_TEXT);
  let tooltip = text;
  if (hiddenTag && !isOriginalHiddenItem) {
    tooltip = translateBuilder(BUILDER.HIDE_ITEM_HIDDEN_PARENT_INFORMATION);
  }

  const icon = hiddenTag ? <VisibilityOff /> : <Visibility />;

  switch (type) {
    case ActionButton.MENU_ITEM: {
      const menuItem = (
        <MenuItem
          key={text}
          onClick={handleToggleHide}
          className={HIDDEN_ITEM_BUTTON_CLASS}
          disabled={!isOriginalHiddenItem}
          data-cy={buildHideButtonId(Boolean(hiddenTag))}
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
