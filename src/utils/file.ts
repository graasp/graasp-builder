import { filesize } from 'filesize';

// eslint-disable-next-line import/prefer-default-export
export const humanFileSize = (size: number): string =>
  filesize(size, { base: 2, standard: 'jedec' });
