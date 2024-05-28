import { FormEventHandler, useRef, useState } from 'react';

import { Dialog, Stack, styled, useTheme } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { DEFAULT_LIGHT_PRIMARY_COLOR } from '@graasp/ui';

import { ImageUp as ImageUpIcon } from 'lucide-react';

import CropModal, {
  MODAL_TITLE_ARIA_LABEL_ID,
} from '@/components/common/CropModal';

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

  const onEdit = () => {
    inputRef.current?.click();
  };

  return (
    <Stack justifyContent="flex-start" direction="column">
      <Stack
        onClick={onEdit}
        onKeyDown={(event) => {
          if (['Enter', ' '].includes(event.key)) {
            onEdit();
          }
        }}
        aria-label="change folder avatar"
        role="button"
        tabIndex={0}
        height={THUMBNAIL_DIMENSION}
        width={THUMBNAIL_DIMENSION}
        borderRadius={2}
        bgcolor={DEFAULT_LIGHT_PRIMARY_COLOR}
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
        sx={{ cursor: 'pointer' }}
      >
        {newAvatar ? (
          <img
            alt="folder thumbnail"
            src={newAvatar}
            height={THUMBNAIL_DIMENSION}
            width={THUMBNAIL_DIMENSION}
          />
        ) : (
          <ImageUpIcon color={theme.palette.primary.main} />
        )}
      </Stack>
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
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
    </Stack>
  );
};

export default FolderThumbnail;
