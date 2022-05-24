import React, { useState } from 'react';
import { Button } from '@graasp/ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  confirmDeleteButton: {
    color: 'red',
  },
  deleteButton: {
    color: 'red',
  },
}));

const DeleteMemberDialog = ({ id }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const { mutate: deleteMember } = useMutation(MUTATION_KEYS.DELETE_MEMBER);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('Confirm deletion')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('DeleteAccountMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" variant="text">
            {t('Cancel')}
          </Button>
          <Button
            id={CONFIRM_DELETE_BUTTON_ID}
            className={classes.confirmDeleteButton}
            onClick={() => deleteMember({ id })}
            color="secondary"
            autoFocus
            variant="text"
          >
            {t('Delete Permanently')}
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="text"
        className={classes.deleteButton}
        color="secondary"
        onClick={() => setOpen(true)}
      >
        {t('Delete Account')}
      </Button>
    </>
  );
};

DeleteMemberDialog.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DeleteMemberDialog;
