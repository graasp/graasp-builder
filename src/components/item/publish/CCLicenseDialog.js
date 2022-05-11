import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { Button } from '@graasp/ui';

const CCLicenseDialog = ({
  open,
  setOpen,
  disabled,
  className,
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
        className={className}
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
  className: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

CCLicenseDialog.defaultProps = {
  className: '',
  disabled: false,
};

export default CCLicenseDialog;
