import DeleteIcon from '@mui/icons-material/Delete';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { ButtonType } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_RECYCLE_BUTTON_CLASS,
} from '../../config/selectors';

type Props = {
  itemIds: string[];
  color?: IconButtonProps['color'];
  id?: string;
  type?: string;
  onClick?: () => void;
};

const RecycleButton: FC<Props> = ({
  itemIds,
  color = 'default',
  id,
  type = ButtonType.ICON_BUTTON,
  onClick,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: recycleItems } = useMutation<unknown, unknown, string[]>(
    MUTATION_KEYS.RECYCLE_ITEMS,
  );

  const handleClick = () => {
    recycleItems(itemIds);
    onClick?.();
  };

  const text = translateBuilder(BUILDER.RECYCLE_ITEM_BUTTON);

  switch (type) {
    case ButtonType.MENU_ITEM:
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
    case ButtonType.ICON_BUTTON:
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

export default RecycleButton;
