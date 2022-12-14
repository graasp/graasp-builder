import { PixelCrop } from 'react-image-crop';

import { THUMBNAIL_EXTENSION } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
  extension = THUMBNAIL_EXTENSION,
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext('2d');

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  ctx?.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        console.error('Canvas is empty');
        return;
      }
      resolve(blob);
    }, extension);
  });
};
