import React from 'react';

import { DialogActions, DialogContent, DialogContentText } from '@mui/material';

import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

type Props = {
  handleSubmit: () => void;
  disableSubmission?: boolean;
  handleBack: () => void;
};

const ConfirmLicenseDialogContent = ({
  handleSubmit,
  disableSubmission,
  handleBack,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <>
      <DialogContent sx={{ paddingX: 3 }}>
        <DialogContentText>
          {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_CONTENT)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleBack}>
          {translateBuilder(BUILDER.BACK)}
        </Button>
        <Button onClick={handleSubmit} disabled={disableSubmission}>
          {translateBuilder(BUILDER.CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );
};

export default ConfirmLicenseDialogContent;
