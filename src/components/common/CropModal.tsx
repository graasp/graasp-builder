import { ReactEventHandler, useRef, useState } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Button } from '@graasp/ui';

import { THUMBNAIL_ASPECT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { CROP_MODAL_CONFIRM_BUTTON_CLASSNAME } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CancelButton from './CancelButton';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
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
  open: boolean;
  onClose: () => void;
  src: string;
  onConfirm: (blob: Blob | null) => void;
};

const CropModal = ({
  onConfirm,
  open,
  onClose,
  src,
}: CropProps): JSX.Element => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { t } = useBuilderTranslation();

  const handleOnConfirm = async () => {
    const image = imageRef.current;
    if (!image || !completedCrop) {
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

  const label = 'crop-modal-title';

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby={label}>
      <DialogTitle id={label}>{t(BUILDER.CROP_IMAGE_MODAL_TITLE)}</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={onClose} />
        <Button
          onClick={handleOnConfirm}
          className={CROP_MODAL_CONFIRM_BUTTON_CLASSNAME}
        >
          {t(BUILDER.CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropModal;
