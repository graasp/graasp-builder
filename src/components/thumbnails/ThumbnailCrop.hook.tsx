import { RefObject, useEffect, useRef, useState } from 'react';

type UseThumbnailCrop = {
  showCropModal: boolean;
  fileSource?: string;
  croppedUrl?: string;
  inputRef: RefObject<HTMLInputElement>;
  onSelectFile: (target: HTMLInputElement) => void;
  onClose: () => void;
  onConfirmCrop: (croppedImage: Blob | null) => void;
  onEdit: () => void;
  resetCroppedUrl: () => void;
};

type Props = {
  currentThumbnail?: string;
  setChanges: (payload: { thumbnail?: Blob }) => void;
  onDelete?: () => void;
};

export const useThumbnailCrop = ({
  currentThumbnail,
  setChanges,
}: Props): UseThumbnailCrop => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedUrl, setCroppedUrl] = useState<string>();
  const [fileSource, setFileSource] = useState<string>();

  useEffect(() => setCroppedUrl(currentThumbnail), [currentThumbnail]);

  const resetCroppedUrl = () => setCroppedUrl(undefined);

  const onSelectFile = (target: HTMLInputElement) => {
    if (target.files && target.files?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setFileSource(reader.result as string),
      );
      reader.readAsDataURL(target.files?.[0]);
      setShowCropModal(true);
    }
  };

  const onClose = () => {
    setShowCropModal(false);
    setFileSource(undefined);
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
      setCroppedUrl(url);
    } catch (error) {
      console.error(error);
    }

    return true;
  };

  const onEdit = () => {
    inputRef.current?.click();
  };

  return {
    showCropModal,
    croppedUrl,
    fileSource,
    inputRef,
    onClose,
    onSelectFile,
    onConfirmCrop,
    onEdit,
    resetCroppedUrl,
  };
};

export default useThumbnailCrop;
