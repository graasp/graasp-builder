import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import ConfirmLicenseDialogContent from '../../common/ConfirmLicenseDialogContent';
import useItemLicense from '../../hooks/useItemLicense';

type Props = {
  open: boolean;
  setOpen: (b: boolean) => void;
  item: DiscriminatedItem;
};

const commonsSx = {
  border: '1px solid #eee',
  borderRadius: 2,
  minWidth: 300,
  alignItems: 'center',
};
const UpdateLicenseDialog = ({ open, setOpen, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [confirmationStep, setConfirmationStep] = useState(false);

  const {
    handleSubmit,
    licenseForm,
    creativeCommons,
    requireAttributionValue,
  } = useItemLicense({
    item,
    commonsSx,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const submitForm = () => {
    handleSubmit();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setConfirmationStep(false);
    }
  }, [open]);

  return (
    <Dialog open={open} transitionDuration={0} onClose={handleClose}>
      <DialogTitle>
        {translateBuilder(BUILDER.ITEM_SETTINGS_LICENSE_TITLE)}
      </DialogTitle>

      {!confirmationStep ? (
        <>
          <DialogContent sx={{ paddingX: 3 }}>{licenseForm}</DialogContent>
          {requireAttributionValue && (
            <Box display="flex" justifyContent="center">
              {creativeCommons}
            </Box>
          )}
          <DialogActions>
            <Button variant="text" onClick={handleClose}>
              {translateBuilder(BUILDER.CANCEL_BUTTON)}
            </Button>

            <Button
              variant="text"
              disabled={!requireAttributionValue}
              onClick={() => setConfirmationStep(true)}
            >
              {translateBuilder(BUILDER.SAVE_BTN)}
            </Button>
          </DialogActions>
        </>
      ) : (
        <ConfirmLicenseDialogContent
          handleSubmit={submitForm}
          handleBack={() => setConfirmationStep(false)}
        />
      )}
    </Dialog>
  );
};

export default UpdateLicenseDialog;
