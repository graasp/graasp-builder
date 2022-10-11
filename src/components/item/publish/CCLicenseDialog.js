import PropTypes from 'prop-types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

const CCLicenseDialog = ({
  open,
  setOpen,
  disabled,
  buttonName,
  handleSubmit,
}) => {
  const { t } = useTranslation();

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
        <DialogTitle>{t('Confirm Your Submission')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'Please verify that your item fits the CC License, and do not change to a more restricted option.',
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant="text">
            {t('Cancel')}
          </Button>
          <Button onClick={handleSubmit}>{t('Confirm')}</Button>
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
