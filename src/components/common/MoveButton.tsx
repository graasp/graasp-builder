import { IconButtonProps } from '@mui/material/IconButton';

import { FC, useContext } from 'react';

import { BUILDER } from '@graasp/translations';
import { MoveButton as GraaspMoveButton } from '@graasp/ui';

import { BUTTON_TYPES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MOVE_BUTTON_CLASS,
} from '../../config/selectors';
import { MoveItemModalContext } from '../context/MoveItemModalContext';

type MoveButtonProps = {
  itemIds: string[];
  color?: IconButtonProps['color'];
  id?: string;
  type?: string;
  onClick?: () => void;
};

const MoveButton: FC<MoveButtonProps> = ({
  itemIds,
  color = 'default',
  id,
  type = BUTTON_TYPES.ICON_BUTTON,
  onClick,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { openModal: openMoveModal } = useContext(MoveItemModalContext);

  const handleMove = () => {
    openMoveModal(itemIds);
    onClick?.();
  };

  return (
    <GraaspMoveButton
      color={color}
      type={type}
      id={id}
      onClick={handleMove}
      text={translateBuilder(BUILDER.MOVE_BUTTON)}
      menuItemClassName={ITEM_MENU_MOVE_BUTTON_CLASS}
      iconClassName={ITEM_MOVE_BUTTON_CLASS}
    />
  );
};

export default MoveButton;
