import { useState } from 'react';

import { Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { ACCOUNT } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useAccountTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import {
  CONFIRM_DELETE_BUTTON_ID,
  DELETE_MEMBER_BUTTON_ID,
} from '../../config/selectors';
import CancelButton from '../common/CancelButton';

type Props = {
  id: string;
};

const DeleteMemberDialog = ({ id }: Props): JSX.Element => {
  const { t: translateAccount } = useAccountTranslation();
  const [open, setOpen] = useState(false);
  const { mutate: deleteMember } = mutations.useDeleteMember();

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
          {translateAccount(ACCOUNT.PROFILE_DELETE_ACCOUNT_MODAL_TITLE)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id={alertDialogDescription}>
            {translateAccount(ACCOUNT.PROFILE_DELETE_ACCOUNT_MODAL_INFORMATION)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={() => setOpen(false)} color="primary" />
          <Button
            id={CONFIRM_DELETE_BUTTON_ID}
            onClick={() => deleteMember({ id })}
            color="error"
            autoFocus
            variant="text"
          >
            {translateAccount(
              ACCOUNT.PROFILE_DELETE_ACCOUNT_MODAL_CONFIRM_BUTTON,
            )}
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
              {translateAccount(ACCOUNT.PROFILE_DELETE_ACCOUNT_TITLE)}
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
              onClick={() => setOpen(true)}
            >
              {translateAccount(ACCOUNT.PROFILE_DELETE_ACCOUNT_BUTTON)}
            </Button>
            <Typography variant="caption">
              {translateAccount(ACCOUNT.PROFILE_DELETE_ACCOUNT_INFORMATION)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DeleteMemberDialog;
