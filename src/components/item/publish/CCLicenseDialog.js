import PropTypes from 'prop-types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { BUILDER, COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../config/i18n';

const CCLicenseDialog = ({
  open,
  setOpen,
  disabled,
  buttonName,
  handleSubmit,
}) => {
  const { t: translateCommon } = useCommonTranslation();
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
          <Button onClick={handleClose} autoFocus variant="text">
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
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
