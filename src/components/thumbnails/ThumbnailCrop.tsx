import { MouseEvent } from 'react';

import {
  Box,
  Dialog,
  IconButton,
  Stack,
  styled,
  useTheme,
} from '@mui/material';

import { Trash2 as DeleteIcon, ImageUp as ImageUpIcon } from 'lucide-react';

import CropModal, {
  MODAL_TITLE_ARIA_LABEL_ID,
} from '@/components/common/CropModal';
import { useBuilderTranslation } from '@/config/i18n';
import {
  IMAGE_PLACEHOLDER_FOLDER,
  IMAGE_THUMBNAIL_FOLDER,
  IMAGE_THUMBNAIL_UPLOADER,
  REMOVE_THUMBNAIL_BUTTON,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import useThumbnailCrop from './ThumbnailCrop.hook';

const THUMBNAIL_DIMENSION = 60;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const HoveredBox = styled(Stack)(({ zIndex }: { zIndex: number }) => ({
  zIndex,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  aspectRatio: 1,
  position: 'absolute',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  ':hover': {
    opacity: 0.85,
  },
}));

const sxDeleteButton = () => {
  const bgColor = (opacity: number) => `rgb(255, 255, 255, ${opacity})`;
  return {
    backgroundColor: bgColor(0.5),
    ':hover': {
      backgroundColor: bgColor(0.8),
    },
  };
};

type Props = {
  setChanges: (payload: { thumbnail?: Blob }) => void;
  onDelete?: () => void;
  thumbnailSize?: number;
  fullWidth?: boolean;
  currentThumbnail?: string;
  isUploading?: boolean;
  border?: string;
};

const ThumbnailCrop = ({
  setChanges,
  onDelete,
  thumbnailSize = THUMBNAIL_DIMENSION,
  fullWidth = false,
  currentThumbnail,
  isUploading = false,
  border,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const theme = useTheme();
  const {
    inputRef,
    croppedUrl,
    fileSource,
    showCropModal,
    resetCroppedUrl,
    onEdit,
    onSelectFile,
    onClose,
    onConfirmCrop,
  } = useThumbnailCrop({ currentThumbnail, setChanges, onDelete });

  const handleDelete = (e: MouseEvent) => {
    // Stop propagation to prevent opening upload file modal.
    e.stopPropagation();
    resetCroppedUrl();
    onDelete?.();
  };

  const buildDeleteButton = (): JSX.Element | undefined => {
    if (!isUploading && onDelete && croppedUrl) {
      return (
        <Box
          position="absolute"
          top={5}
          right={5}
          zIndex={theme.zIndex.drawer - 1}
        >
          <IconButton
            data-cy={REMOVE_THUMBNAIL_BUTTON}
            aria-label={t(BUILDER.THUMBNAIL_UPLOADER_DELETE_ARIA_LABEL)}
            color="error"
            size="medium"
            sx={sxDeleteButton}
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    }
    return undefined;
  };

  return (
    <>
      <Stack
        onClick={onEdit}
        onKeyDown={(event) => {
          if (['Enter', ' '].includes(event.key)) {
            onEdit();
          }
        }}
        aria-label={t(BUILDER.THUMBNAIL_UPLOADER_UPDATE_ARIA_LABEL)}
        role="button"
        tabIndex={0}
        minWidth={thumbnailSize}
        width={fullWidth ? '100%' : thumbnailSize}
        maxWidth={fullWidth ? '100%' : thumbnailSize}
        border={border}
        borderRadius={2}
        bgcolor="#E4DFFF"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
        sx={{ cursor: 'pointer', aspectRatio: 1 }}
      >
        {buildDeleteButton()}
        <HoveredBox
          bgcolor={theme.palette.primary.main}
          borderRadius={2}
          zIndex={theme.zIndex.drawer - 2}
        >
          <ImageUpIcon color={theme.palette.secondary.light} />
        </HoveredBox>
        {croppedUrl ? (
          <img
            data-cy={IMAGE_THUMBNAIL_FOLDER}
            alt={t(BUILDER.THUMBNAIL_UPLOADER_IMAGE_ALT)}
            src={croppedUrl}
            width="100%"
          />
        ) : (
          <ImageUpIcon
            data-cy={IMAGE_PLACEHOLDER_FOLDER}
            color={theme.palette.primary.main}
          />
        )}
      </Stack>
      <VisuallyHiddenInput
        data-cy={IMAGE_THUMBNAIL_UPLOADER}
        type="file"
        accept="image/*"
        onChange={(e) => onSelectFile(e.target)}
        ref={inputRef}
      />
      {fileSource && (
        <Dialog
          open={showCropModal}
          onClose={onClose}
          aria-labelledby={MODAL_TITLE_ARIA_LABEL_ID}
        >
          <CropModal
            onClose={onClose}
            src={fileSource}
            onConfirm={onConfirmCrop}
          />
        </Dialog>
      )}
    </>
  );
};

export default ThumbnailCrop;
