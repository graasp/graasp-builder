import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { grey } from '@material-ui/core/colors';
import { StatusBar as UppyStatusBar } from '@uppy/react';
import '@uppy/status-bar/dist/style.css';

const useStyles = makeStyles(() => ({
  snackbarContentRoot: {
    background: 'white',
  },
  snackbarContentMessage: {
    width: '85%',
  },
  snackbarContentAction: {
    color: grey[500],
  },
}));

const StatusBar = ({ handleClose, open, uppy }) => {
  const classes = useStyles();

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
      <SnackbarContent
        message={statusBar}
        action={action}
        classes={{
          root: classes.snackbarContentRoot,
          message: classes.snackbarContentMessage,
          action: classes.snackbarContentAction,
        }}
      />
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
