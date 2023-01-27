/**
 * @deprecated use graasp sdk
 * this object only exists for tests
 */
export const PERMISSION_LEVELS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin',
};

/**
 * @deprecated use graasp sdk
 * this object only exists for tests
 */
export const ITEM_LAYOUT_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

/**
 * @deprecated use graasp sdk
 * this object only exists for tests
 */
export const ITEM_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
  S3_FILE: 's3File',
  LINK: 'embeddedLink',
  SHORTCUT: 'shortcut',
  DOCUMENT: 'document',
  APP: 'app',
  H5P: 'h5p',
  // the following isn't a real item type
  // but is used for the creation modal
  ZIP: 'zip',
};

/**
 * @deprecated use graasp sdk instead
 * this object only exists for tests
 */
export const MIME_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  VIDEO: ['video/mp4'],
  AUDIO: ['audio/mpeg', 'audio/mp3'],
  PDF: ['application/pdf'],
};
