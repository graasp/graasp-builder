import { MouseEventHandler } from 'react';

import { IconButtonProps } from '@mui/material';

import { BUILDER } from '@graasp/translations';
import {
  ActionButtonVariant,
  CopyButton as GraaspCopyButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_COPY_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../config/selectors';
import { useCopyItemModalContext } from '../context/CopyItemModalContext';

export type Props = {
  color?: IconButtonProps['color'];
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLLIElement>;
  type?: ActionButtonVariant;
  itemIds: string[];
};

const CopyButton = ({
  itemIds,
  color,
  id,
  type,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { openModal: openCopyModal } = useCopyItemModalContext();

  const handleCopy: MouseEventHandler<HTMLButtonElement | HTMLLIElement> = (
    e,
  ) => {
    openCopyModal(itemIds);
    onClick?.(e);
  };

  return (
    <GraaspCopyButton
      type={type}
      id={id}
      text={translateBuilder(BUILDER.ITEM_COPY_BUTTON)}
      color={color}
      iconClassName={ITEM_COPY_BUTTON_CLASS}
      menuItemClassName={ITEM_MENU_COPY_BUTTON_CLASS}
      onClick={handleCopy}
    />
  );
};

export default CopyButton;
