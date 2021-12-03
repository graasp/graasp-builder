import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import PropTypes from 'prop-types';
import 'react-image-crop/dist/ReactCrop.css';
import { withTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { THUMBNAIL_ASPECT } from '../../config/constants';
import { getCroppedImg } from '../../utils/image';
import { CROP_MODAL_CONFIRM_BUTTON_CLASSNAME } from '../../config/selectors';

const styles = () => ({
  content: {
    textAlign: 'center',
  },
});
class CropModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      content: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    crop: {},
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (img) => {
    this.imageRef = img;
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

    const y = (imgHeight - height) / 2;
    const x = (imgWidth - width) / 2;

    const crop = {
      unit: 'px',
      width,
      height,
      x,
      y,
      aspect,
    };
    this.setState({
      crop,
    });

    return false; // Return false if you set crop state in here.
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  handleOnConfirm = async () => {
    const { onConfirm } = this.props;
    const { crop } = this.state;
    const final = await this.makeClientCrop(crop);
    onConfirm(final);
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(this.imageRef, crop);
      return croppedImage;
    }
    return false;
  }

  render() {
    const { open, onClose, t, src, classes } = this.props;
    const { crop } = this.state;

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="crop-modal-title">
        <DialogTitle id="crop-modal-title">{t('Crop Image')}</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText>
            {t('Crop your chosen image to fit the image size requirements.')}
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
          <Button onClick={onClose}>{t('Cancel')}</Button>
          <Button
            onClick={this.handleOnConfirm}
            color="primary"
            className={CROP_MODAL_CONFIRM_BUTTON_CLASSNAME}
          >
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const StyledComponent = withStyles(styles)(CropModal);

export default withTranslation()(StyledComponent);
