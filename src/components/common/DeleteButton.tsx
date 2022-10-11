import { FC, MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DeleteButton as GraaspDeleteButton } from '@graasp/ui';

import { ITEM_DELETE_BUTTON_CLASS } from '../../config/selectors';
import DeleteItemDialog from '../main/DeleteItemDialog';

type Props = {
  itemIds: string[];
  color?: string;
  id?: string;
  type?: string;
  onClick: MouseEventHandler;
};

const DeleteButton: FC<Props> = ({ itemIds, color, id, type, onClick }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    onClick?.();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const text = t('Delete');

  return (
    <>
      <GraaspDeleteButton
        key={text}
        onClick={handleClickOpen}
        text={text}
        aria-label={text}
        id={id}
        color={color}
        type={type}
        className={ITEM_DELETE_BUTTON_CLASS}
      />
      <DeleteItemDialog
        open={open}
        handleClose={handleClose}
        itemIds={itemIds}
      />
    </>
  );
};

export default DeleteButton;
