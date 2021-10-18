import { THUMBNAIL_EXTENSION } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const getCroppedImg = (image, crop, extension = THUMBNAIL_EXTENSION) => {
  const canvas = document.createElement('canvas');
  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext('2d');

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        // eslint-disable-next-line no-param-reassign
        blob.name = 'croppedImage.jpg';
        resolve(blob);
      },
      extension,
      1,
    );
  });
};
