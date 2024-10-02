import { useState } from 'react';
import { useParams } from 'react-router';

import { Box } from '@mui/material';

import { DiscriminatedItem, MAX_NUMBER_OF_FILES_UPLOAD } from '@graasp/sdk';
import { FileDropper } from '@graasp/ui';

import { AxiosProgressEvent } from 'axios';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

type Props = {
  onComplete?: () => void;
  onUpdate?: (e: AxiosProgressEvent) => void;
  onError?: (e: Error) => void;
  buttons?: JSX.Element;
  onStart?: () => void;
  /** id of the component */
  id?: string;
  previousItemId?: DiscriminatedItem['id'];
};

const FileUploader = ({
  onError,
  onUpdate,
  onComplete,
  onStart,
  buttons,
  id,
  previousItemId,
}: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();
  const { itemId: parentItemId } = useParams();
  const [error, setError] = useState<string>();

  const { mutateAsync: uploadFiles, isPending } = mutations.useUploadFiles();

  const [totalProgress, setTotalProgress] = useState(0);

  // send n request as long as the backend cannot handle multi files
  // complex notification handling to keep one uploading toast
  // trigger n success toast
  const onDrop = async (files: File[]): Promise<void> => {
    // update progress callback function scaled over the number of files sent
    const updateForManyFiles = (idx: number) => (e: AxiosProgressEvent) => {
      // suppose previous files are completely uploaded
      const progress = ((e.progress ?? 0) + idx) / files.length;
      setTotalProgress(progress);
      onUpdate?.({ ...e, progress });
    };

    if (files.length > MAX_NUMBER_OF_FILES_UPLOAD) {
      setError(
        t(BUILDER.CANNOT_UPLOAD_MORE_FILES, {
          count: MAX_NUMBER_OF_FILES_UPLOAD,
        }),
      );
      onError?.({
        message: t(BUILDER.CANNOT_UPLOAD_MORE_FILES, {
          count: MAX_NUMBER_OF_FILES_UPLOAD,
        }),
      } as Error);
      return;
    }
    setError(undefined);

    onStart?.();

    // eslint-disable-next-line no-restricted-syntax
    for (let idx = 0; idx < files.length; idx += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await uploadFiles({
          files: [files[idx]],
          id: parentItemId,
          previousItemId,
          onUploadProgress: updateForManyFiles(idx),
        });
      } catch (e) {
        onError?.(e as Error);
      }
    }
    onComplete?.();
  };

  return (
    <Box width="100%" id={id} height="100%">
      <FileDropper
        message={t(BUILDER.DROPZONE_HELPER_TEXT)}
        onChange={(e) => {
          if (e.target.files) {
            // transform from filelist to file array
            onDrop([...e.target.files]);
          }
        }}
        isLoading={isPending}
        uploadProgress={Math.ceil(totalProgress * 100)}
        multiple
        onDrop={onDrop}
        error={error}
        buttonText={t(BUILDER.DROPZONE_HELPER_ACTION)}
        hints={t(BUILDER.DROPZONE_HELPER_LIMIT_REMINDER_TEXT)}
        buttons={buttons}
      />
    </Box>
  );
};

export default FileUploader;
