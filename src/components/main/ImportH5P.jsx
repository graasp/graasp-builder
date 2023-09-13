import { useEffect, useState } from 'react';
import { useMatch } from 'react-router';

import Typography from '@mui/material/Typography';

import { routines } from '@graasp/query-client';
import { MAX_ZIP_FILE_SIZE } from '@graasp/sdk';

import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { getUUID } from '@/utils/shortUrl';

import { useBuilderTranslation } from '../../config/i18n';
import notifier from '../../config/notifier';
import { buildItemPath } from '../../config/paths';
import { H5P_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { configureH5PImportUppy, humanFileSize } from '../../utils/uppy';

const ImportH5P = () => {
  const [uppy, setUppy] = useState(null);
  const match = useMatch(buildItemPath());
  const itemUuid = match?.params?.itemId;
  const itemId = getUUID(itemUuid);
  const { t: translateBuilder } = useBuilderTranslation();

  const onComplete = (result) => {
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      notifier({ type: routines.importH5PRoutine.SUCCESS });
    }
  };
  const onError = (error) => {
    notifier({ type: routines.importH5PRoutine.FAILURE, payload: { error } });
  };

  const onUpload = () => {
    notifier({ type: routines.importH5PRoutine.REQUEST });
  };

  const applyUppy = () =>
    setUppy(
      configureH5PImportUppy({
        itemId,
        onComplete,
        onError,
        onUpload,
      }),
    );

  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyUppy();
    // update uppy configuration each time itemId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!uppy) {
    return null;
  }

  return (
    <>
      <Typography variant="h6">
        {translateBuilder(BUILDER.IMPORT_H5P_TITLE)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_INFORMATIONS)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_WARNING)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_LIMITATIONS_TEXT, {
          maxSize: humanFileSize(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <div id={H5P_DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          width="100%"
          proudlyDisplayPoweredByUppy={false}
        />
      </div>
    </>
  );
};

export default ImportH5P;
