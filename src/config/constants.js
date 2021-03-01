import { API_HOST as API_HOST_ENV } from '../env.json';

export const APP_NAME = 'Graasp';

export const API_HOST =
  API_HOST_ENV || process.env.REACT_APP_API_HOST || 'http://localhost:3111';

export const DESCRIPTION_MAX_LENGTH = 30;

export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

export const ROOT_ID = 'root-id';

export const TREE_PREVENT_SELECTION = {
  NONE: 'none',
  SELF_AND_CHILDREN: 'selfAndChildren',
};

export const TREE_VIEW_HEIGHT = 200;
export const TREE_VIEW_MAX_WIDTH = 400;
export const UUID_LENGTH = 36;

export const ITEM_TYPES = {
  SPACE: 'Space',
  APPLICATION: 'Application',
  EXERCISE: 'Exercise',
  FILE: 'file',
  S3_FILE: 's3-file',
};
export const MIME_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  VIDEO: ['video/mp4'],
  AUDIO: ['audio/mpeg', 'audio/mp3'],
};
export const DRAWER_WIDTH = 300;
export const DEFAULT_LOCALE = 'en-US';

export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};

export const DEFAULT_PERMISSION_LEVEL = PERMISSION_LEVELS.WRITE;

export const MODES = {
  GRID: 'grid',
  LIST: 'list',
};

export const DEFAULT_MODE = MODES.LIST;

export const ORDERING = {
  ASC: 'asc',
  DESC: 'desc',
};

export const TABLE_MIN_WIDTH = 750;

export const ROWS_PER_PAGE_OPTIONS = [10, 25];

export const ITEM_DATA_TYPES = {
  DATE: 'date',
};

export const LEFT_MENU_WIDTH = 250;
export const HEADER_HEIGHT = 64;

export const FILE_UPLOAD_MAX_FILES = 5;
export const ITEMS_TABLE_ROW_ICON_COLOR = 'grey';
export const UPLOAD_FILES_METHODS = {
  S3: 's3',
  DEFAULT: 'default',
};
