import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { BUILDER, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { THUMBNAIL_ASPECT } from '../../config/constants';
import { CROP_MODAL_CONFIRM_BUTTON_CLASSNAME } from '../../config/selectors';
import { getCroppedImg } from '../../utils/image';
import CancelButton from './CancelButton';

type Props = {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  t: Function;
  src: string;
  onConfirm: (blob: Blob | null) => void;
};

type State = {
  crop: PixelCrop;
  imageRef: HTMLImageElement | null;
};

class CropModal extends Component<Props, State> {
  state = {
    crop: {} as PixelCrop,
    imageRef: null,
  };

  handleOnConfirm = async () => {
    const { onConfirm } = this.props;
    const { crop } = this.state;
    const final = await this.makeClientCrop(crop);
    onConfirm(final);
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (img: HTMLImageElement) => {
    this.setState({ imageRef: img });
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

    const crop = {
      width,
      height,
      x,
      y,
      aspect,
      unit: 'px',
    } as PixelCrop;
    this.setState({
      crop,
    });

    return false; // Return false if you set crop state in here.
  };

  onCropChange = (crop: Crop, _percentageCrop: Crop) => {
    this.setState({ crop: crop as PixelCrop });
  };

  async makeClientCrop(crop: PixelCrop) {
    const { imageRef } = this.state;
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(imageRef, crop);
      return croppedImage;
    }
    return null;
  }

  render() {
    const { open, onClose, t, src } = this.props;
    const { crop } = this.state;
    const label = 'crop-modal-title';

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby={label}>
        <DialogTitle id={label}>
          {t(BUILDER.CROP_IMAGE_MODAL_TITLE)}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            {t(BUILDER.CROP_IMAGE_MODAL_CONTENT_TEXT)}
          </DialogContentText>
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onChange={this.onCropChange}
          />
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose} />
          <Button
            onClick={this.handleOnConfirm}
            className={CROP_MODAL_CONFIRM_BUTTON_CLASSNAME}
          >
            {t(BUILDER.CONFIRM_BUTTON)}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withTranslation(namespaces.builder)(CropModal);
