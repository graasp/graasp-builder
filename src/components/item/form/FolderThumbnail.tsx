import { FormEventHandler, useRef, useState } from 'react';

import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Dialog, Typography, styled, useTheme } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import CropModal, {
  MODAL_TITLE_ARIA_LABEL_ID,
} from '@/components/common/CropModal';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import defaultImage from '../../../resources/avatar.png';

// import { EditModalContentPropType } from './EditModalWrapper';

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

export type FolderThumbnailProps = {
  setChanges: (
    payload: Partial<DiscriminatedItem> & { thumbnail?: Blob },
  ) => void;
};

const FolderThumbnail = ({ setChanges }: FolderThumbnailProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string>();
  const [fileSource, setFileSource] = useState<string>();
  const { t: translateBuilder } = useBuilderTranslation();
  const theme = useTheme();

  const onSelectFile: FormEventHandler<HTMLInputElement> = (e) => {
    const t = e.target as HTMLInputElement;
    if (t.files && t.files?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setFileSource(reader.result as string),
      );
      reader.readAsDataURL(t.files?.[0]);
      setShowCropModal(true);
    }
  };

  const onClose = () => {
    setShowCropModal(false);
    if (inputRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      inputRef.current.value = null;
    }
  };

  const onConfirmCrop = (croppedImage: Blob | null) => {
    onClose();

    if (!croppedImage) {
      return console.error('croppedImage is not defined');
    }
    // submit cropped image
    try {
      setChanges({ thumbnail: croppedImage });
      // replace img src with croppedImage
      const url = URL.createObjectURL(croppedImage);
      setNewAvatar(url);
    } catch (error) {
      console.error(error);
    }

    return true;
  };
  return (
    <Box display="flex" justifyContent="flex-start" flexDirection="column">
      <Typography variant="body2">
        {translateBuilder(BUILDER.SETTINGS_THUMBNAIL_TITLE)}
      </Typography>
      <div
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            inputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="change folder avatar"
        style={{
          cursor: 'pointer',
          height: 60,
          width: 60,
        }}
      >
        {newAvatar ? (
          <Box
            component="div"
            sx={{
              position: 'relative',
              height: 60,
              width: 60,
              borderRadius: '50%',
              // maxHeight: { xs: 40, md: 55 },
              // maxWidth: { xs: 40, md: 55 },
            }}
          >
            <img
              alt="default folder thumbnail"
              src={newAvatar || defaultImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '90%',
                width: '90%',
                borderRadius: '50%',
              }}
            />
            <EditIcon
              fontSize="small"
              style={{
                position: 'absolute',
                bottom: '1',
                right: '1',
                borderRadius: '50%',
                color: 'white',
                backgroundColor: theme.palette.primary.main,
                padding: 2,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              height: 60,
              width: 60,
              borderRadius: '50%',
              backgroundColor: 'lightblue',
              // maxHeight: { xs: 40, md: 55 },
              // maxWidth: { xs: 40, md: 55 },
            }}
          >
            <AddToPhotosIcon
              fontSize="medium"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'darkblue',
              }}
            />
          </Box>
        )}
      </div>
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        // onInput={onSelectFile}
        onChange={onSelectFile}
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
    </Box>
  );
};

export default FolderThumbnail;
