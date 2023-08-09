import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import CancelButton from '../../common/CancelButton';

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  disabled?: boolean;
  buttonName: string;
  handleSubmit: () => void;
};

const CCLicenseDialog = ({
  open,
  setOpen,
  disabled = false,
  buttonName,
  handleSubmit,
}: Props): JSX.Element => {
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
        variant="contained"
        sx={{ my: 1 }}
        onClick={handleClickOpen}
        disabled={disabled} // disable the button if no option is selected
      >
        {buttonName}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_TITLE)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_CONTENT)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose} />
          <Button onClick={handleSubmit}>
            {translateBuilder(BUILDER.CONFIRM_BUTTON)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CCLicenseDialog;
