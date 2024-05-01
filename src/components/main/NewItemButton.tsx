import { useState } from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '../../config/i18n';
import { CREATE_ITEM_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import NewItemModal from './NewItemModal';

type Props = {
  previousItemId?: DiscriminatedItem['id'];
};

const NewItemButton = ({ previousItemId }: Props): JSX.Element => {
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
      <Tooltip title={translateBuilder(BUILDER.NEW_ITEM_BUTTON)}>
        <Fab
          sx={{ position: 'fixed', bottom: 20, right: 20 }}
          id={CREATE_ITEM_BUTTON_ID}
          onClick={handleClickOpen}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      {/* TODO: necessary space for scroll */}
      <br />
      <br />
      <NewItemModal
        open={open}
        handleClose={handleClose}
        previousItemId={previousItemId}
      />
    </>
  );
};

export default NewItemButton;
