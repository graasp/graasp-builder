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
        variant="outlined"
        className={className}
        onClick={handleClickOpen}
        disabled={disabled} // disable the button if no option is selected
      >
        {t('Submit')}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Confirm Your Submission')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Attention: This action is irreversible!')}
            <br />
            {t(
              'Once you submit your choice, you cannot remove selected Creative Commons License, or change to a more restricted choice.',
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
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
};

CCLicenseDialog.defaultProps = {
  className: '',
};

export default CCLicenseDialog;
