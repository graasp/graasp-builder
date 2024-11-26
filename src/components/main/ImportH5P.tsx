import { ChangeEventHandler } from 'react';
import { useParams } from 'react-router-dom';

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import {
  DiscriminatedItem,
  MAX_ZIP_FILE_SIZE,
  formatFileSize,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button, UploadFileButton } from '@graasp/ui';

import { mutations } from '@/config/queryClient';

import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
import {
  CREATE_ITEM_CLOSE_BUTTON_ID,
  H5P_DASHBOARD_UPLOADER_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';

const ImportH5P = ({
  onClose,
  previousItemId,
}: {
  onClose?: () => void;
  previousItemId?: DiscriminatedItem['id'];
}): JSX.Element => {
  const { itemId } = useParams();
  const { mutateAsync: importH5P, isPending: isLoading } =
    mutations.useImportH5P();
  const { update, close: closeNotification } = useUploadWithProgress();
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();

  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files?.length) {
      try {
        await importH5P({
          onUploadProgress: update,
          id: itemId,
          previousItemId,
          file: e.target.files[0],
        });

        closeNotification();
        onClose?.();
      } catch (error) {
        if (error instanceof Error) {
          closeNotification(error);
        }
        console.error(error);
      }
    }
  };

  return (
    <>
      <DialogTitle>{translateBuilder(BUILDER.IMPORT_H5P_TITLE)}</DialogTitle>
      <DialogContent>
        <Stack gap={1}>
          <Typography variant="body1">
            {translateBuilder(BUILDER.IMPORT_H5P_INFORMATIONS)}
          </Typography>
          <Typography variant="body1">
            {translateBuilder(BUILDER.IMPORT_H5P_WARNING)}
          </Typography>
          <Typography variant="body1">
            {translateBuilder(BUILDER.IMPORT_H5P_LIMITATIONS_TEXT, {
              maxSize: formatFileSize(MAX_ZIP_FILE_SIZE),
            })}
          </Typography>
          <UploadFileButton
            isLoading={isLoading}
            loadingText={translateBuilder(BUILDER.UPLOADING)}
            onChange={onChange}
            accept=".h5p"
            id={H5P_DASHBOARD_UPLOADER_ID}
            text={translateBuilder(BUILDER.UPLOAD_H5P_BUTTON)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          id={CREATE_ITEM_CLOSE_BUTTON_ID}
          variant="text"
          onClick={onClose}
        >
          {translateCommon(COMMON.CLOSE_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );
};

export default ImportH5P;
