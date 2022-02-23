import React, { useMemo, useState, useEffect } from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core';
import { StatusBar } from '@uppy/react';
import { grey } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import '@uppy/status-bar/dist/style.css';
import { configureFileUppy } from '../../utils/uppy';
import { useMutation } from '../../config/queryClient';

const UppyContext = React.createContext();
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

const UppyContextProvider = ({ enable, itemId, children }) => {
  const classes = useStyles();
  const [uppy, setUppy] = useState(null);
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { mutate: onFileUploadComplete } = useMutation(
    MUTATION_KEYS.FILE_UPLOAD,
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenStatusBar(false);
  };

  const onComplete = (result) => {
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      onFileUploadComplete({ id: itemId });
    }

    return false;
  };

  const onError = (error) => {
    onFileUploadComplete({ id: itemId, error });
  };

  const onUpload = () => {
    setOpenStatusBar(true);
  };

  useEffect(() => {
    if (enable) {
      setUppy(
        configureFileUppy({
          itemId,
          onComplete,
          onError,
          onUpload,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, enable]);

  const value = useMemo(() => ({ uppy }), [uppy]);

  const statusBar = (
    <StatusBar
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
    <UppyContext.Provider value={value}>
      {uppy && (
        <Snackbar
          open={openStatusBar}
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
      )}
      {children}
    </UppyContext.Provider>
  );
};

UppyContextProvider.propTypes = {
  children: PropTypes.node,
  enable: PropTypes.bool,
  itemId: PropTypes.string,
};

UppyContextProvider.defaultProps = {
  children: null,
  enable: false,
  itemId: undefined,
};

export { UppyContext, UppyContextProvider };
