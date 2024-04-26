import { useContext, useRef } from 'react';

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { DROPZONE_HELPER_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import NewItemButton from '../main/NewItemButton';
import { UppyContext } from './UppyContext';

const DropzoneHelper = (): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { uppy } = useContext(UppyContext);
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    const { current } = ref;
    if (current) {
      current.click();
    }
  };

  const handleFiles = () => {
    const { current } = ref;
    if (current) {
      const { files } = current;
      if (files) {
        // add files selected to uppy, this will upload them
        [...files].map((file) =>
          // add name to display file name in the ItemsTable
          uppy?.addFile({ data: file, name: file.name, type: file.type }),
        );
      } else {
        console.error('no files found !');
      }
    }
  };

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      direction="column"
      flexGrow={1}
      spacing={3}
      sx={{ height: '100%', position: 'relative', top: '15%' }}
      id={DROPZONE_HELPER_ID}
    >
      <UploadFileOutlinedIcon color="primary" sx={{ fontSize: '50px' }} />
      <Typography align="center" variant="h4" color="text.secondary">
        {t(BUILDER.DROPZONE_HELPER_TEXT)}
      </Typography>
      <Typography variant="h5" color="text.secondary">
        {t(BUILDER.DROPZONE_HELPER_OPTIONAL_ACTION_TEXT)}
      </Typography>
      <Stack direction="row" gap={2}>
        <Stack alignItems="center" gap={1}>
          <Button
            variant="contained"
            onClick={handleClick}
            startIcon={<FolderOutlinedIcon />}
          >
            {t(BUILDER.DROPZONE_HELPER_ACTION)}
          </Button>
          <input
            style={{ display: 'none' }}
            type="file"
            multiple
            ref={ref}
            onChange={handleFiles}
          />
          <Typography variant="caption" color="text.secondary">
            {t(BUILDER.DROPZONE_HELPER_LIMIT_REMINDER_TEXT)}
          </Typography>
        </Stack>
        <Box>
          <NewItemButton />
        </Box>
      </Stack>
    </Stack>
  );
};

export default DropzoneHelper;
