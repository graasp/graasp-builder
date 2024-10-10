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
    // get the image html element
    const image = imageRef.current;

    if (!image || !completedCrop) {
      // this should never happen but we better check
      setIsError(true);
      throw new Error('Crop canvas does not exist, this should never happen');
    }

    // declare the canvas that will be used to render the cropped image
    // we use an off-screen canvas to not overload the main thread
    const offscreen = new OffscreenCanvas(
      completedCrop.width,
      completedCrop.height,
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    /**
     * Compute the relative width and height
     * They express the size of the crop in terms of a relative portion of the original image.
     * For example if only the first quarter of the image was used in the crop,
     * the relativeCrop would be 0.5, 0.5, meaning half of the height, and half of the width
     */
    const relativeCrop = {
      width: completedCrop.width / image.width,
      height: completedCrop.height / image.height,
    };

    /**
     * The scaling factor between the "real" media size and the size shown in the preview window
     * We need to compute this as the crop is expressed in terms of the preview size but we want to apply the crop to the "real" image
     * `image.width` is the size of the preview
     * `image.naturalWidth` is the size of the uploaded media
     */
    const uiScalingFactor = image.naturalWidth / image.width;

    // compute the final canvas size given the relative size of the crop and the initial size of the image
    const finalCanvasWidth = Math.floor(
      relativeCrop.width * image.naturalWidth,
    );
    const finalCanvasHeight = Math.floor(
      relativeCrop.height * image.naturalHeight,
    );

    // assign the final size to the canvas
    offscreen.width = finalCanvasWidth;
    offscreen.height = finalCanvasHeight;

    // smoothing factor to use, this ensures the image keep a high quality when drawn on the canvas
    ctx.imageSmoothingQuality = 'high';

    // compute the source image offsets and size so it can be drawn on to the canvas
    const sourceOffsetX = completedCrop.x * uiScalingFactor;
    const sourceOffsetY = completedCrop.y * uiScalingFactor;
    const sourceWidth = image.naturalWidth * relativeCrop.width;
    const sourceHeight = image.naturalHeight * relativeCrop.height;

    // finally draw the image on to the canvas
    ctx.drawImage(
      // the source HTML element from which to draw
      image,
      // the sx and sy offsets on the source image
      sourceOffsetX,
      sourceOffsetY,
      // source image width and height
      sourceWidth,
      sourceHeight,
      // dx and dy values denote the origin where to draw on the canvas
      0,
      0,
      // we want to fill the whole canvas
      finalCanvasWidth,
      finalCanvasHeight,
    );

    // the blob is converted to webP as this is the format that
    // the backend uses anyway to store the images. This allows transparency in opposition to jpeg
    const blob = await offscreen.convertToBlob({
      type: 'image/webp',
      // Use a quality factor less than 1 to allow lossy compression.
      // This reduces the size of the uploaded image
      quality: 0.8,
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
