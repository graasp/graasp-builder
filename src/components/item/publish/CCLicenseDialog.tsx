import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { BUILDER } from '../../../langs/constants';
import CancelButton from '../../common/CancelButton';

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  handleSubmit: () => void;
  isNewDialog?: boolean;
  handleBack?: () => void;
  disableSubmission?: boolean;
};

const CCLicenseDialog = ({
  open,
  setOpen,
  handleSubmit,
  isNewDialog = true,
  handleBack,
  disableSubmission,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const renderDialogContent = () => (
    <>
      <DialogContent sx={{ p: isNewDialog ? 3 : 0 }}>
        <DialogContentText>
          {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_CONTENT)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isNewDialog ? (
          <CancelButton onClick={handleClose} />
        ) : (
          <Button variant="text" onClick={handleBack}>
            {translateBuilder(BUILDER.BACK)}
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={disableSubmission}>
          {translateBuilder(BUILDER.CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );

  return isNewDialog ? (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_TITLE)}
      </DialogTitle>
      {renderDialogContent()}
    </Dialog>
  ) : (
    renderDialogContent()
  );
};

export default CCLicenseDialog;
