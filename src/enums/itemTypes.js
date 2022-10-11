/**
 * @deprecated use graasp sdk
 */
const ITEM_TYPES = {
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

Object.freeze(ITEM_TYPES);
/**
 * @deprecated use graasp sdk
 */
export default ITEM_TYPES;
