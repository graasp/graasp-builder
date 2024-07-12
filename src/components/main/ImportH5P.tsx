import { useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  MAX_ZIP_FILE_SIZE,
  formatFileSize,
} from '@graasp/sdk';
import { UploadFileButton } from '@graasp/ui';

import { mutations } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import { H5P_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';

const ImportH5P = ({
  onComplete,
  previousItemId,
}: {
  onComplete?: () => void;
  previousItemId?: DiscriminatedItem['id'];
}): JSX.Element => {
  const { itemId } = useParams();
  const { mutateAsync: importH5P, isLoading } = mutations.useImportH5P();
  const { update, close: closeNotification } = useUploadWithProgress();
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Box overflow="auto">
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_INFORMATIONS)}
      </Typography>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_WARNING)}
      </Typography>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_LIMITATIONS_TEXT, {
          maxSize: formatFileSize(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <UploadFileButton
        isLoading={isLoading}
        loadingText={translateBuilder(BUILDER.UPLOADING)}
        onChange={(e) => {
          if (e.target.files?.length) {
            importH5P({
              onUploadProgress: update,
              id: itemId,
              previousItemId,
              file: e.target.files[0],
            })
              .then(() => {
                closeNotification();
                onComplete?.();
              })
              .catch((error) => {
                closeNotification(error);
              });
          }
        }}
        accept=".h5p"
        id={H5P_DASHBOARD_UPLOADER_ID}
        text={translateBuilder(BUILDER.UPLOAD_H5P_BUTTON)}
      />
    </Box>
  );
};

export default ImportH5P;
