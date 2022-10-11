import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Button } from '@graasp/ui';

import { useMutation } from '../../config/queryClient';
import {
  CONFIRM_DELETE_BUTTON_ID,
  DELETE_MEMBER_BUTTON_ID,
} from '../../config/selectors';

const DeleteMemberDialog = ({ id }) => {
  const { t } = useTranslation();

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
            onClick={() => deleteMember({ id })}
            color="error"
            autoFocus
            variant="text"
          >
            {t('Delete Permanently')}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="flex-start"
        my={1}
      >
        <Grid item xs={8}>
          <Grid item xs={12}>
            <Typography variant="h5">{t('Delete this account')}</Typography>
          </Grid>
          <Grid
            container
            spacing={3}
            display="flex"
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            py={1}
            m={0}
          >
            <Button
              id={DELETE_MEMBER_BUTTON_ID}
              variant="contained"
              color="error"
              my={1}
              onClick={() => setOpen(true)}
            >
              {t('Delete Account')}
            </Button>
            <Typography variant="caption">
              {t(
                'Once you delete an account, there is no going back. Please be certain.',
              )}
            </Typography>
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
