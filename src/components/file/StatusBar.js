import { StatusBar as UppyStatusBar } from '@uppy/react';
import '@uppy/status-bar/dist/style.css';
import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { grey } from '@mui/material/colors';

const StyledSnackbarContent = styled(SnackbarContent)(() => ({
  '.MuiSnackbarContent-root': {
    background: 'white',
  },
  '.MuiSnackbarContent-message': {
    width: '85%',
  },
  '.MuiSnackbarContent-action': {
    color: grey[500],
  },
}));

const StatusBar = ({ handleClose, open, uppy }) => {
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
      <CloseIcon fontSize="small" />
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

StatusBar.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  uppy: PropTypes.shape({}),
};

StatusBar.defaultProps = {
  open: false,
  uppy: null,
};

export default StatusBar;
