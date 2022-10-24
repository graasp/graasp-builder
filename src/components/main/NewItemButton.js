import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

import { useState } from 'react';

import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { CREATE_ITEM_BUTTON_ID } from '../../config/selectors';
import NewItemModal from './NewItemModal';

const NewItemButton = ({ fontSize }) => {
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
      <Tooltip
        placement="left"
        title={translateBuilder(BUILDER.NEW_ITEM_BUTTON)}
        arrow
      >
        <Button
          id={CREATE_ITEM_BUTTON_ID}
          fontSize={fontSize}
          onClick={handleClickOpen}
          sx={{
            cursor: 'pointer',
            flex: 'none',
            ml: 1,
          }}
        >
          <AddIcon />
          {translateBuilder(BUILDER.NEW_ITEM_BUTTON)}
        </Button>
      </Tooltip>
      <NewItemModal
        open={open}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </>
  );
};

NewItemButton.propTypes = {
  fontSize: PropTypes.string,
};

NewItemButton.defaultProps = {
  fontSize: 'large',
};

export default NewItemButton;
