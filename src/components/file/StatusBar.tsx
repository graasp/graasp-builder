import '@uppy/status-bar/dist/style.css';

import { Close } from '@mui/icons-material';
import { IconButton, Snackbar, SnackbarContent, styled } from '@mui/material';
import { grey } from '@mui/material/colors';

import Uppy from '@uppy/core';
import { StatusBar as UppyStatusBar } from '@uppy/react';

const StyledSnackbarContent = styled(SnackbarContent)(() => ({
  '&.MuiSnackbarContent-root': {
    background: 'white',
  },
  '& .MuiSnackbarContent-message': {
    width: '85%',
  },
  '& .MuiSnackbarContent-action': {
    color: grey[500],
  },
}));

type Props = {
  handleClose: () => void;
  open?: boolean;
  uppy?: Uppy;
};

const StatusBar = ({
  handleClose,
  open = false,
  uppy,
}: Props): JSX.Element | null => {
  if (!uppy) {
    return null;
  }

  const statusBar = (
    <UppyStatusBar
      uppy={uppy}
      showProgressDetails
      hideCancelButton
      hideAfterFinish={false}
    />
  );
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <StyledSnackbarContent message={statusBar} action={action} />
    </Snackbar>
  );
};

export default StatusBar;
