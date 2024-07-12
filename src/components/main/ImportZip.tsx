import { useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import { MAX_ZIP_FILE_SIZE, formatFileSize } from '@graasp/sdk';
import { UploadFileButton } from '@graasp/ui';

import { mutations } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import { ZIP_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';

const ImportZip = (): JSX.Element => {
  const { itemId } = useParams();
  const { mutateAsync: importZip } = mutations.useImportZip();
  const { update, close: closeNotification } = useUploadWithProgress();

  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Box overflow="auto">
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.IMPORT_ZIP_INFORMATION)}
      </Typography>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.IMPORT_ZIP_WARNING)}
      </Typography>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.IMPORT_ZIP_LIMITATIONS_TEXT, {
          maxSize: formatFileSize(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <UploadFileButton
        isLoading={false}
        onChange={(e) => {
          if (e.target.files?.length) {
            importZip({
              onUploadProgress: update,
              id: itemId,
              file: e.target.files[0],
            })
              .then(() => {
                closeNotification();
              })
              .catch((error) => {
                closeNotification(error);
              });
          }
        }}
        accept=".zip"
        id={ZIP_DASHBOARD_UPLOADER_ID}
        text={translateBuilder(BUILDER.IMPORT_ZIP_BUTTON)}
      />
    </Box>
  );
};

export default ImportZip;
