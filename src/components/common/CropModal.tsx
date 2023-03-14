import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { THUMBNAIL_ASPECT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { CROP_MODAL_CONFIRM_BUTTON_CLASSNAME } from '../../config/selectors';
import { getCroppedImg } from '../../utils/image';
import CancelButton from './CancelButton';

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  onConfirm: (blob: Blob | null) => void;
};

const CropModal = ({ open, onClose, src, onConfirm }: Props): JSX.Element => {
  const [crop, setCrop] = useState<PixelCrop>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    unit: 'px',
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement>();
  const { t } = useBuilderTranslation();

  // If you setState the crop in here you should return false.
  const onImageLoaded = (img: HTMLImageElement) => {
    setImageRef(img);
    const { width: imgWidth, height: imgHeight } = img;

    const aspect = THUMBNAIL_ASPECT;
    const outputImageAspectRatio = aspect;
    const inputImageAspectRatio = imgWidth / imgHeight;

    let width = imgWidth;
    let height = imgHeight;
    // if it's bigger than our target aspect ratio
    if (inputImageAspectRatio > outputImageAspectRatio) {
      width = imgHeight * outputImageAspectRatio;
    } else if (inputImageAspectRatio < outputImageAspectRatio) {
      height = imgWidth / outputImageAspectRatio;
    }

    const y = Math.floor((imgHeight - height) / 2);
    const x = Math.floor((imgWidth - width) / 2);

    const newCrop = {
      width,
      height,
      x,
      y,
      aspect,
      unit: 'px',
    } as PixelCrop;
    setCrop(newCrop);

    return false; // Return false if you set crop state in here.
  };

  const onCropChange = (c: Crop, _percentageCrop: Crop) => {
    setCrop(c as PixelCrop);
  };

  const makeClientCrop = async (c: PixelCrop) => {
    if (imageRef && c.width && c.height) {
      const croppedImage = await getCroppedImg(imageRef, c);
      return croppedImage;
    }
    return null;
  };

  const handleOnConfirm = async () => {
    const final = await makeClientCrop(crop);
    onConfirm(final);
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
          src={src}
          crop={crop}
          ruleOfThirds
          onImageLoaded={onImageLoaded}
          onChange={onCropChange}
        />
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
