import DeleteIcon from '@mui/icons-material/Delete';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { BUILDER } from '@graasp/translations';
import { ActionButton, ActionButtonVariant } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_RECYCLE_BUTTON_CLASS,
} from '../../config/selectors';

type Props = {
  itemIds: string[];
  color?: IconButtonProps['color'];
  id?: string;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const RecycleButton = ({
  itemIds,
  color = 'default',
  id,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: recycleItems } = mutations.useRecycleItems();

  const handleClick = () => {
    recycleItems(itemIds);
    onClick?.();
  };

  const text = translateBuilder(BUILDER.RECYCLE_ITEM_BUTTON);

  switch (type) {
    case ActionButton.MENU_ITEM:
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
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={text}>
          <span>
            <IconButton
              id={id}
              color={color}
              className={ITEM_RECYCLE_BUTTON_CLASS}
              aria-label={text}
              onClick={handleClick}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default RecycleButton;
