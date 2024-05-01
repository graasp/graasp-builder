import 'react-image-crop/dist/ReactCrop.css';

import { ReactEventHandler, useRef, useState } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';

import {
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { Button } from '@graasp/ui';

import { THUMBNAIL_ASPECT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { CROP_MODAL_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CancelButton from './CancelButton';

export const MODAL_TITLE_ARIA_LABEL_ID = 'crop-modal-title';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export type CropProps = {
  onClose: () => void;
  src: string;
  onConfirm: (blob: Blob | null) => void;
};

const CropModal = ({ onConfirm, onClose, src }: CropProps): JSX.Element => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { t } = useBuilderTranslation();

  const handleOnConfirm = async () => {
    const image = imageRef.current;

    if (!image || !completedCrop) {
      setIsError(true);
      throw new Error('Crop canvas does not exist');
    }

    const offscreen = new OffscreenCanvas(
      completedCrop.width,
      completedCrop.height,
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1

    offscreen.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    offscreen.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });
    onConfirm(blob);
  };

  // If you setState the crop in here you should return false.
  const onImageLoaded: ReactEventHandler<HTMLImageElement> = (event) => {
    if (!imageRef.current) {
      imageRef.current = event.currentTarget;
    }

    const { width: imgWidth, height: imgHeight } = event.currentTarget;
    setCrop(centerAspectCrop(imgWidth, imgHeight, THUMBNAIL_ASPECT));
  };

  return (
    <>
      <DialogTitle id={MODAL_TITLE_ARIA_LABEL_ID}>
        {t(BUILDER.CROP_IMAGE_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText>
          {t(BUILDER.CROP_IMAGE_MODAL_CONTENT_TEXT)}
        </DialogContentText>
        <ReactCrop
          crop={crop}
          onChange={(_, percentageCrop) => setCrop(percentageCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={THUMBNAIL_ASPECT}
          // circularCrop
          ruleOfThirds
        >
          <img
            ref={imageRef}
            alt={t(BUILDER.CROP_IMAGE_MODAL_IMAGE_ALT_TEXT)}
            width="100%"
            height="100%"
            src={src}
            onLoad={onImageLoaded}
          />
        </ReactCrop>
        {isError && (
          <Alert severity="error">
            {t(BUILDER.CROP_IMAGE_MODAL_UNEXPECTED_ERROR)}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={onClose} />
        <Button
          onClick={handleOnConfirm}
          id={CROP_MODAL_CONFIRM_BUTTON_ID}
          disabled={isError}
        >
          {t(BUILDER.CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );
};

export default CropModal;
