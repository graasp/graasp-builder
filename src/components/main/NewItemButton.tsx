import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { ButtonProps } from '@mui/material';

import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { CREATE_ITEM_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import NewItemModal from './NewItemModal';

type Props = {
  size?: ButtonProps['size'];
};

const NewItemButton = ({ size }: Props): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { t: translateBuilder } = useBuilderTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button size={size} id={CREATE_ITEM_BUTTON_ID} onClick={handleClickOpen}>
        <Add />
        {translateBuilder(BUILDER.NEW_ITEM_BUTTON)}
      </Button>
      <NewItemModal open={open} handleClose={handleClose} />
    </>
  );
};

export default NewItemButton;
