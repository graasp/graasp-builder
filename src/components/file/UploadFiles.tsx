import { Box, Typography } from '@mui/material';

import { MAX_FILE_SIZE, formatFileSize } from '@graasp/sdk';

import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import FileUploader from './FileUploader';

type Props = {
  onComplete: () => void;
};
const UploadFiles = ({ onComplete }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.UPLOAD_FILE_INFORMATIONS)}
      </Typography>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.UPLOAD_FILE_LIMITATIONS_TEXT, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
          maxSize: formatFileSize(MAX_FILE_SIZE),
        })}
      </Typography>
      <Box id={DASHBOARD_UPLOADER_ID}>
        <FileUploader onComplete={onComplete} />
      </Box>
    </>
  );
};

export default UploadFiles;
