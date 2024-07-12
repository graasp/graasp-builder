import { useState } from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { ButtonProps } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { CREATE_ITEM_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import NewItemModal from './NewItemModal';

type Props = {
  previousItemId?: DiscriminatedItem['id'];
  size?: ButtonProps['size'];
};

const NewItemButton = ({
  previousItemId,
  size = 'small',
}: Props): JSX.Element => {
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
      <Button
        id={CREATE_ITEM_BUTTON_ID}
        onClick={handleClickOpen}
        color="primary"
        aria-label="add"
        startIcon={<AddIcon />}
        size={size}
      >
        {translateBuilder(BUILDER.NEW_ITEM_BUTTON)}
      </Button>
      <NewItemModal
        open={open}
        handleClose={handleClose}
        previousItemId={previousItemId}
      />
    </>
  );
};

export default NewItemButton;
