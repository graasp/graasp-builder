import env from '../env.json';

const {
  API_HOST: ENV_API_HOST,
  S3_FILES_HOST: ENV_S3_FILES_HOST,
  UPLOAD_METHOD: ENV_UPLOAD_METHOD,
  SHOW_NOTIFICATIONS: ENV_SHOW_NOTIFICATIONS,
  AUTHENTICATION_HOST: ENV_AUTHENTICATION_HOST,
  NODE_ENV: ENV_NODE_ENV,
} = env;

export const APP_NAME = 'Graasp';

export const ENV = {
  DEVELOPMENT: 'development',
};

export const NODE_ENV =
  ENV_NODE_ENV ||
  process.env.REACT_APP_NODE_ENV ||
  process.env.NODE_ENV ||
  ENV.DEVELOPMENT;

export const API_HOST =
  ENV_API_HOST || process.env.REACT_APP_API_HOST || 'http://localhost:3111';

export const S3_FILES_HOST =
  ENV_S3_FILES_HOST || process.env.REACT_APP_S3_FILES_HOST || 'localhost';

export const SHOW_NOTIFICATIONS =
  ENV_SHOW_NOTIFICATIONS ||
  process.env.REACT_APP_SHOW_NOTIFICATIONS === 'true' ||
  false;

export const AUTHENTICATION_HOST =
  ENV_AUTHENTICATION_HOST ||
  process.env.REACT_APP_AUTHENTICATION_HOST ||
  'http://localhost:3111';

export const DESCRIPTION_MAX_LENGTH = 30;

export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

export const ROOT_ID = 'root-id';

export const TREE_PREVENT_SELECTION = {
  NONE: 'none',
  SELF_AND_CHILDREN: 'selfAndChildren',
};

export const TREE_VIEW_MAX_WIDTH = 400;
export const UUID_LENGTH = 36;

export const ITEM_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
  S3_FILE: 's3File',
  LINK: 'embeddedLink',
  SHORTCUT: 'shortcut',
};
export const MIME_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  VIDEO: ['video/mp4'],
  AUDIO: ['audio/mpeg', 'audio/mp3'],
  PDF: ['application/pdf'],
};
export const DRAWER_WIDTH = 300;
export const DEFAULT_LOCALE = 'en-US';

export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};

export const DEFAULT_PERMISSION_LEVEL = PERMISSION_LEVELS.WRITE;

export const PERMISSIONS_EDITION_ALLOWED = [
  PERMISSION_LEVELS.WRITE,
  PERMISSION_LEVELS.ADMIN,
];

export const ITEM_LAYOUT_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

export const DEFAULT_ITEM_LAYOUT_MODE = ITEM_LAYOUT_MODES.LIST;

export const ORDERING = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ROWS_PER_PAGE_OPTIONS = [10, 25];

export const ITEM_DATA_TYPES = {
  DATE: 'date',
};

export const LEFT_MENU_WIDTH = 250;
export const RIGHT_MENU_WIDTH = 300;
export const HEADER_HEIGHT = 64;

export const FILE_UPLOAD_MAX_FILES = 5;
export const ITEMS_TABLE_ROW_ICON_COLOR = '#333333';
export const UPLOAD_FILES_METHODS = {
  S3: 's3',
  DEFAULT: 'default',
};

export const UPLOAD_METHOD =
  ENV_UPLOAD_METHOD ||
  process.env.REACT_APP_UPLOAD_METHOD ||
  UPLOAD_FILES_METHODS.DEFAULT;

export const ITEM_ICON_MAX_SIZE = 25;

export const USERNAME_MAX_LENGTH = 30;

export const SHARE_ITEM_MODAL_MIN_WIDTH = 120;

// React Query Configs
export const STALE_TIME_MILLISECONDS = 1000 * 60 * 60;
export const CACHE_TIME_MILLISECONDS = 1000 * 60 * 60;

export const LOADING_CONTENT = '…';
export const SETTINGS = {
  ITEM_LOGIN: {
    name: 'item-login',
    OPTIONS: {
      USERNAME: 'username',
      USERNAME_AND_PASSWORD: 'username+password',
    },
    SIGN_IN_MODE: {
      USERNAME: 'username',
      MEMBER_ID: 'memberId',
    },
  },
};

export const SETTINGS_ITEM_LOGIN_DEFAULT = SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME;
export const SETTINGS_ITEM_LOGIN_SIGN_IN_MODE_DEFAULT =
  SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME;
