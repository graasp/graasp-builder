import { useContext } from 'react';

import { IconButtonProps } from '@mui/material/IconButton';

import { BUILDER } from '@graasp/translations';
import {
  ActionButton,
  ActionButtonVariant,
  MoveButton as GraaspMoveButton,
} from '@graasp/ui';

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
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const MoveButton = ({
  itemIds,
  color = 'default',
  id,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: MoveButtonProps): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { openModal: openMoveModal } = useContext(MoveItemModalContext);

  // TODO: return error?
  if (!openMoveModal) {
    return null;
  }

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
