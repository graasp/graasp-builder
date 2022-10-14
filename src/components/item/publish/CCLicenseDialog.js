import PropTypes from 'prop-types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import { BUILDER, COMMON, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';

const CCLicenseDialog = ({
  open,
  setOpen,
  disabled,
  buttonName,
  handleSubmit,
}) => {
  const { t: commonT } = useTranslation(namespaces.common);
  const { t } = useBuilderTranslation();

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
          {t(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_TITLE)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(BUILDER.ITEM_SETTINGS_CC_LICENSE_MODAL_CONTENT)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant="text">
            {commonT(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button onClick={handleSubmit}>{t(BUILDER.CONFIRM_BUTTON)}</Button>
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
