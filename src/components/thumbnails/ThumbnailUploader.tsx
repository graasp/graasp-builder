import { useEffect } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import { theme } from '@graasp/ui';

import { useDataSyncContext } from '@/components/context/DataSyncContext';

import ThumbnailCrop from './ThumbnailCrop';
import useThumbnailUploader from './ThumbnailUploader.hook';

const THUMBNAIL_SIZE = 150;
const THUMBNAIL_BORDER = '1px solid #ddd';

export enum EventChanges {
  ON_UPLOADING = 'onUploading',
  ON_HAS_THUMBNAIL = 'onHasThumbnail',
  ON_NO_THUMBNAIL = 'onNoThumbnail',
  ON_LOADING = 'onLoading',
}

type Props = {
  item: PackedItem;
  thumbnailSize?: number;
  fullWidth?: boolean;
  syncStatusKey?: string;
  topCornerElement?: JSX.Element;

  onChange?: (event: EventChanges) => void;
};

export const ThumbnailUploader = ({
  item,
  thumbnailSize = THUMBNAIL_SIZE,
  fullWidth = false,
  syncStatusKey,
  topCornerElement,
  onChange,
}: Props): JSX.Element => {
  const { computeStatusFor } = useDataSyncContext();
  const {
    uploadingProgress,
    isThumbnailUploading,
    isUploadingError,
    itemThumbnail,

    handleDelete,
    onThumbnailUpload,
  } = useThumbnailUploader({ item });

  // useEffect is needed to solve Cannot update a component while rendering a different component.
  useEffect(() => {
    if (syncStatusKey) {
      computeStatusFor(syncStatusKey, {
        isLoading: isThumbnailUploading,
        isError: isUploadingError,
        isSuccess: !isThumbnailUploading && !isUploadingError,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeStatusFor, isThumbnailUploading, isUploadingError]);

  useEffect(() => {
    switch (true) {
      case isThumbnailUploading:
        onChange?.(EventChanges.ON_UPLOADING);
        break;
      case itemThumbnail.hasThumbnail:
        onChange?.(EventChanges.ON_HAS_THUMBNAIL);
        break;
      case !itemThumbnail.hasThumbnail:
        onChange?.(EventChanges.ON_NO_THUMBNAIL);
        break;
      default:
      // nothing to do
    }
  }, [isThumbnailUploading, itemThumbnail.hasThumbnail, onChange]);

  return (
    <Box position="relative">
      <ThumbnailCrop
        currentThumbnail={itemThumbnail.url}
        thumbnailSize={thumbnailSize}
        fullWidth={fullWidth}
        onDelete={handleDelete}
        setChanges={onThumbnailUpload}
        isUploading={isThumbnailUploading}
        border={THUMBNAIL_BORDER}
      />
      <Box
        position="absolute"
        top={15}
        right={15}
        zIndex={theme.zIndex.drawer - 1}
      >
        {topCornerElement}
        {isThumbnailUploading && (
          <CircularProgress
            variant="determinate"
            value={uploadingProgress}
            size={25}
            sx={{ bgcolor: 'white', borderRadius: '50%' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ThumbnailUploader;
