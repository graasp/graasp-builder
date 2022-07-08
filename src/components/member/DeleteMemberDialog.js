import React, { useState } from 'react';
import { Button } from '@graasp/ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import {
  CONFIRM_DELETE_BUTTON_ID,
  DELETE_MEMBER_BUTTON_ID,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  confirmDeleteButton: {
    color: 'red',
  },
  deleteButton: {
    backgroundColor: 'red',
    margin: theme.spacing(1, 0),
  },
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: theme.spacing(1, 0),
  },
  deleteAccountContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, 0),
  },
}));

const DeleteMemberDialog = ({ id }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const { mutate: deleteMember } = useMutation(MUTATION_KEYS.DELETE_MEMBER);

  const alertDialogTitle = 'alert-dialog-title';
  const alertDialogDescription = 'alert-dialog-description';

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={alertDialogTitle}
        aria-describedby={alertDialogDescription}
      >
        <DialogTitle id={alertDialogTitle}>{t('Confirm deletion')}</DialogTitle>
        <DialogContent>
          <DialogContentText id={alertDialogDescription}>
            {t('Your account will be deleted permanently.')}
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
      <Grid container spacing={3} className={classes.mainContainer}>
        <Grid item xs={8}>
          <Grid item xs={12}>
            <Typography variant="h5">Delete this account</Typography>
          </Grid>
          <Grid
            container
            spacing={3}
            className={classes.deleteAccountContainer}
          >
            <Typography variant="caption">
              {t(
                'Once you delete an account, there is no going back. Please be certain.',
              )}
            </Typography>
            <Button
              id={DELETE_MEMBER_BUTTON_ID}
              variant="contained"
              className={classes.deleteButton}
              color="primary"
              onClick={() => setOpen(true)}
            >
              {t('Delete Account')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

DeleteMemberDialog.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DeleteMemberDialog;
