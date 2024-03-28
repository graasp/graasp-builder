import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import CCLicenseSelection from '../publish/CCLicenseSelection';

type Props = {
  open: boolean;
  setOpen: (b: boolean) => void;
  item: DiscriminatedItem;
};

const UpdateLicenseDialog = ({ open, setOpen, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [confirmationStep, setConfirmationStep] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setConfirmationStep(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {translateBuilder(BUILDER.ITEM_SETTINGS_LICENSE_TITLE)}
      </DialogTitle>

      <DialogContent sx={{ paddingX: 0 }}>
        <CCLicenseSelection
          disabled={false}
          confirmSubmitInNewDialog={false}
          item={item}
          confirmationStep={confirmationStep}
          setConfirmationStep={setConfirmationStep}
          onSubmit={handleClose}
        />
      </DialogContent>
      {!confirmationStep && (
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            {translateBuilder(BUILDER.CANCEL_BUTTON)}
          </Button>

          <Button variant="text" onClick={() => setConfirmationStep(true)}>
            {translateBuilder(BUILDER.SAVE_BTN)}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UpdateLicenseDialog;
