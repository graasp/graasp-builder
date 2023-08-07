import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import PropTypes from 'prop-types';

import { useBuilderTranslation } from '../../../config/i18n';
import CancelButton from '../../common/CancelButton';

const CCLicenseDialog = ({
  open,
  setOpen,
  disabled,
  buttonName,
  handleSubmit,
}) => {
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
        my={1}
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

CCLicenseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  buttonName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

CCLicenseDialog.defaultProps = {
  disabled: false,
};

export default CCLicenseDialog;
