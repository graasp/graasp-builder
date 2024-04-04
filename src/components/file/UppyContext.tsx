import {
  ReactElement,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Uppy, { ErrorCallback, UploadCompleteCallback } from '@uppy/core';

import { mutations } from '../../config/queryClient';
import { configureFileUppy } from '../../utils/uppy';
import StatusBar from './StatusBar';

type UppyContextType = {
  uppy?: Uppy;
};

const UppyContext = createContext<UppyContextType>({ uppy: undefined });

const UppyContextProvider = ({
  enable = false,
  itemId,
  children,
}: {
  enable?: boolean;
  itemId?: string;
  children: ReactElement | (ReactElement | undefined)[];
}): JSX.Element => {
  const [uppy, setUppy] = useState<Uppy>();
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { mutate: onFileUploadComplete } = mutations.useUploadFiles();

  const handleClose = () => {
    setOpenStatusBar(false);
  };

  const onComplete: UploadCompleteCallback<{ [key: string]: unknown }> = (
    result,
  ) => {
    if (!result?.failed.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const data = result.successful[0].response?.body;
      onFileUploadComplete({ id: itemId, data });
      setOpenStatusBar(false);
    }

    return false;
  };

  const onError: ErrorCallback = (error) => {
    onFileUploadComplete({ id: itemId, error });
  };

  const onUpload = () => {
    setOpenStatusBar(true);
  };

  useEffect(() => {
    if (enable) {
      setUppy(
        // todo: remove
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

export { UppyContext, UppyContextProvider };
