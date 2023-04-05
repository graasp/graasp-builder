import { IconButtonProps } from '@mui/material/IconButton';

import { FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import {
  ActionButton,
  ActionButtonVariant,
  RecycleButton as GraaspRecycleButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_RECYCLE_BUTTON_CLASS,
} from '../../config/selectors';

type Props = {
  color?: IconButtonProps['color'];
  itemIds: string[];
  id?: string;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const RecycleButton: FC<Props> = ({
  color,
  itemIds,
  id,
  type = ActionButton.ICON_BUTTON,
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

  return (
    <GraaspRecycleButton
      type={type}
      iconId={id}
      color={color}
      menuItemClassName={ITEM_MENU_RECYCLE_BUTTON_CLASS}
      iconClassName={ITEM_RECYCLE_BUTTON_CLASS}
      onClick={handleClick}
      text={translateBuilder(BUILDER.RECYCLE_ITEM_BUTTON)}
    />
  );
};

export default RecycleButton;
