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
import { ACCOUNT, COMMON, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useMutation } from '../../config/queryClient';
import {
  CONFIRM_DELETE_BUTTON_ID,
  DELETE_MEMBER_BUTTON_ID,
} from '../../config/selectors';

const DeleteMemberDialog = ({ id }) => {
  const { t: accountT } = useTranslation(namespaces.account);
  const { t: commonT } = useTranslation(namespaces.common);

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
        <DialogTitle id={alertDialogTitle}>
          {accountT(ACCOUNT.PROFILE_DELETE_ACCOUNT_MODAL_TITLE)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id={alertDialogDescription}>
            {accountT(ACCOUNT.PROFILE_DELETE_ACCOUNT_MODAL_INFORMATION)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" variant="text">
            {commonT(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button
            id={CONFIRM_DELETE_BUTTON_ID}
            onClick={() => deleteMember({ id })}
            color="error"
            autoFocus
            variant="text"
          >
            {commonT('Delete Permanently')}
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
            <Typography variant="h5">
              {accountT(ACCOUNT.PROFILE_DELETE_ACCOUNT_TITLE)}
            </Typography>
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
              {accountT(ACCOUNT.PROFILE_DELETE_ACCOUNT_BUTTON)}
            </Button>
            <Typography variant="caption">
              {accountT(ACCOUNT.PROFILE_DELETE_ACCOUNT_INFORMATION)}
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
