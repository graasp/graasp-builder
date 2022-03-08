import React, { useMemo, useState, useEffect } from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import { configureFileUppy } from '../../utils/uppy';
import { useMutation } from '../../config/queryClient';
import StatusBar from './StatusBar';

const UppyContext = React.createContext();

const UppyContextProvider = ({ enable, itemId, children }) => {
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
    if (!result?.failed.length) {
      const data = result.successful[0].response.body;
      onFileUploadComplete({ id: itemId, data });
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

  return (
    <UppyContext.Provider value={value}>
      <StatusBar uppy={uppy} handleClose={handleClose} open={openStatusBar} />
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
