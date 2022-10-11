import { IconButtonProps } from '@mui/material';

import { FC, MouseEventHandler, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyButton as Button } from '@graasp/ui';

import {
  ITEM_COPY_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';

export type Props = {
  color?: IconButtonProps['color'];
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLLIElement>;
  type?: string;
  itemIds: string[];
};

const CopyButton: FC<Props> = ({ itemIds, color, id, type, onClick }) => {
  const { t } = useTranslation();

  const { openModal: openCopyModal } = useContext(CopyItemModalContext);

  const handleCopy: MouseEventHandler<HTMLButtonElement | HTMLLIElement> = (
    e,
  ) => {
    openCopyModal(itemIds);
    onClick?.(e);
  };

  return (
    <Button
      type={type}
      id={id}
      text={t('Copy')}
      color={color}
      iconClassName={ITEM_COPY_BUTTON_CLASS}
      menuItemClassName={ITEM_MENU_COPY_BUTTON_CLASS}
      onClick={handleCopy}
    />
  );
};

export default CopyButton;
