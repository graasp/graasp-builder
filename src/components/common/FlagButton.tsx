import { IconButtonProps } from '@mui/material';

import { FC, useContext } from 'react';

import { BUILDER } from '@graasp/translations';
import {
  ActionButtonVariant,
  FlagButton as GraaspFlagButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_MENU_FLAG_BUTTON_CLASS } from '../../config/selectors';
import { FlagItemModalContext } from '../context/FlagItemModalContext';

export type Props = {
  color?: IconButtonProps['color'];
  onClose?: () => void;
  type?: ActionButtonVariant;
  itemId?: string;
};

const FlagButton: FC<Props> = ({ color, type, onClose, itemId }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { openModal: openFlagModal } = useContext(FlagItemModalContext);

  const handleFlag = () => {
    openFlagModal(itemId);
    onClose?.();
  };

  return (
    <GraaspFlagButton
      type={type}
      text={translateBuilder(BUILDER.ITEM_MENU_FLAG_MENU_ITEM)}
      color={color}
      iconClassName={ITEM_MENU_FLAG_BUTTON_CLASS}
      menuItemClassName={ITEM_MENU_FLAG_BUTTON_CLASS}
      onClick={handleFlag}
    />
  );
};

export default FlagButton;
