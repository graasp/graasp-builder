import { Context, buildSignInPath } from '@graasp/sdk';

import { ITEM_LAYOUT_MODES, ITEM_TYPES, PERMISSION_LEVELS } from '../enums';

export const APP_NAME = 'Graasp';

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

export const NODE_ENV =
  process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || ENV.DEVELOPMENT;

export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

export const API_HOST =
  process.env.REACT_APP_API_HOST || 'http://localhost:3111';

export const SHOW_NOTIFICATIONS =
  process.env.REACT_APP_SHOW_NOTIFICATIONS === 'true' || false;

export const AUTHENTICATION_HOST =
  process.env.REACT_APP_AUTHENTICATION_HOST || 'http://localhost:3001';

export const GRAASP_PERFORM_HOST =
  process.env.REACT_APP_GRAASP_PERFORM_HOST || 'http://localhost:3112';
export const GRAASP_LIBRARY_HOST =
  process.env.REACT_APP_GRAASP_EXPLORE_HOST || 'http://localhost:3005';

export const H5P_INTEGRATION_URL =
  process.env.REACT_APP_H5P_INTEGRATION_URL || `${API_HOST}/p/h5p-integration`;

export const GRAASP_ANALYZER_HOST =
  process.env.REACT_APP_GRAASP_ANALYZER_HOST || 'http://localhost:3113';

export const buildGraaspAnalyzerLink = (id) =>
  `${GRAASP_ANALYZER_HOST}/embedded/${id}`;

export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

export const HIDDEN_ITEM_TAG_ID =
  process.env.REACT_APP_HIDDEN_ITEM_TAG_ID || false;

export const DOMAIN = process.env.REACT_APP_DOMAIN || 'localhost';

export const DESCRIPTION_MAX_LENGTH = 30;

// todo: use local image
// this might require a webpack configuration for cypress
export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

// time to be considered between 2 clicks for a double-click (https://en.wikipedia.org/wiki/Double-click#Speed_and_timing)
export const DOUBLE_CLICK_DELAY_MS = 500;

export const TREE_VIEW_MAX_WIDTH = 400;
export const UUID_LENGTH = 36;

export const MIME_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  VIDEO: ['video/mp4'],
  AUDIO: ['audio/mpeg', 'audio/mp3'],
  PDF: ['application/pdf'],
};
export const DRAWER_WIDTH = 300;
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_LANG = 'en';
export const DEFAULT_EMAIL_FREQUENCY = 'always';

export const emailFrequency = {
  always: 'Always receive email notifications',
  // todo: schedule a digest of the notifications
  // daily: 'Receive email notifications once per day',
  never: 'Disable email notifications',
};

export const DEFAULT_PERMISSION_LEVEL = PERMISSION_LEVELS.READ;

export const DEFAULT_ANALYZER_HEIGHT = 2300;

export const PERMISSIONS_EDITION_ALLOWED = [
  PERMISSION_LEVELS.WRITE,
  PERMISSION_LEVELS.ADMIN,
];

export const DEFAULT_ITEM_LAYOUT_MODE = ITEM_LAYOUT_MODES.LIST;

export const ROWS_PER_PAGE_OPTIONS = [10, 25];

export const LEFT_MENU_WIDTH = 250;
export const RIGHT_MENU_WIDTH = 300;
export const HEADER_HEIGHT = 64;

export const FILE_UPLOAD_MAX_FILES = 15;
export const ITEMS_TABLE_ROW_ICON_COLOR = '#333333';

export const ITEM_ICON_MAX_SIZE = 25;

export const ITEM_NAME_MAX_LENGTH = 15;

export const SHARE_ITEM_MODAL_MIN_WIDTH = 120;

export const LOADING_CONTENT = '…';
export const SETTINGS = {
  ITEM_LOGIN: {
    name: 'item-login',
    OPTIONS: {
      USERNAME: 'username',
      USERNAME_AND_PASSWORD: 'username+password',
    },
    SIGN_IN_MODE: {
      PSEUDONYM: 'pseudonym',
      MEMBER_ID: 'memberId',
    },
  },
  ITEM_PUBLIC: {
    name: 'public-item',
  },
  ITEM_PUBLISHED: {
    name: 'published-item',
  },
  // this tag doesn't exist but is used if none of the visiblity tag is set
  ITEM_PRIVATE: {
    name: 'private-item',
  },
};

export const SETTINGS_ITEM_LOGIN_DEFAULT = SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME;
export const SETTINGS_ITEM_LOGIN_SIGN_IN_MODE_DEFAULT =
  SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME;

export const USER_ITEM_ORDER = 'user_order';

export const ITEM_TYPES_WITH_CAPTIONS = [
  ITEM_TYPES.FOLDER,
  ITEM_TYPES.S3_FILE,
  ITEM_TYPES.FILE,
  ITEM_TYPES.APP,
  ITEM_TYPES.LINK,
  ITEM_TYPES.DOCUMENT,
];

export const MIN_SCREEN_WIDTH = 1000;
export const SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR = 8;

export const FLAG_LIST_MAX_HEIGHT = 250;

export const SHARE_LINK_COLOR = 'black';
export const SHARE_LINK_CONTAINER_BORDER_WIDTH = 1;
export const SHARE_LINK_CONTAINER_BORDER_STYLE = 'dotted';

/* possible choices for number of items per page in grid,
   (must be common multiple for possible row counts of 1,2,3,4,6) */
export const GRID_ITEMS_PER_PAGE_CHOICES = [12, 24, 36, 48];

export const ITEM_DEFAULT_HEIGHT = '70vh';
export const GRAASP_LOGO_HEADER_HEIGHT = 40;

export const ITEMS_TABLE_CONTAINER_HEIGHT = '65vh';

export const DRAG_ICON_SIZE = 18;

export const THUMBNAIL_ASPECT = 1;
export const THUMBNAIL_EXTENSION = 'image/jpeg';
export const THUMBNAIL_SETTING_MAX_WIDTH = 300;
export const THUMBNAIL_SETTING_MAX_HEIGHT = 200;

export const H5P_FILE_DOT_EXTENSION = '.h5p';

export const CATEGORY_TYPES = {
  LEVEL: 'level',
  DISCIPLINE: 'discipline',
  LANGUAGE: 'language',
};

export const CATEGORY_TYPE_TITLES = {
  LEVEL: 'Level',
  DISCIPLINE: 'Discipline',
  LANGUAGE: 'Language',
};

export const CC_LICENSE_ADAPTION_OPTIONS = {
  ALLOW: 'allow',
  ALIKE: 'alike',
  NONE: '',
};

export const CC_LICENSE_ABOUT_URL =
  'https://creativecommons.org/about/cclicenses/';

export const CONTEXT_BUILDER = 'builder';

export const ITEM_VALIDATION_STATUSES = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING: 'pending',
};

export const ITEM_VALIDATION_REVIEW_STATUSES = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

export const VALIDATION_STATUS_NAMES = {
  NOT_VALIDATED: 'not-validated',
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING_AUTOMATIC: 'pending-automatic',
  PENDING_MANUAL: 'pending-manual',
};

export const ADMIN_CONTACT = 'admin@graasp.org';

export const HOST_MAP = {
  [Context.BUILDER]: '/',
  [Context.LIBRARY]: GRAASP_LIBRARY_HOST,
  [Context.PLAYER]: GRAASP_PERFORM_HOST,
  [Context.ANALYTICS]: '',

  [Context.ANALYZER]: '',
  [Context.EXPLORER]: '',
};

export const BUTTON_TYPES = {
  MENU_ITEM: 'menuItem',
  ICON_BUTTON: 'iconButton',
};

export const MEMBERSHIP_TABLE_HEIGHT = 400;
export const MEMBERSHIP_TABLE_ROW_HEIGHT = 75;

// signin page path from auth host
export const SIGN_IN_PATH = buildSignInPath({ host: AUTHENTICATION_HOST });

export const DISPLAY_CO_EDITORS_OPTIONS = {
  YES: {
    value: true,
    label: 'Yes',
  },
  NO: {
    value: false,
    label: 'No',
  },
};

export const ITEM_ACTION_TABS = {
  SETTINGS: 'settings',
  DASHBOARD: 'dashboard',
  LIBRARY: 'library',
  SHARING: 'sharing',
};

export const THUMBNAIL_SIZES = {
  SMALL: 'small',
};

export const ITEM_HEADER_ICON_HEIGHT = 30;
export const AVATAR_ICON_HEIGHT = 30;
export const DEFAULT_LINK_SHOW_IFRAME = false;
export const DEFAULT_LINK_SHOW_BUTTON = true;

export const GRAASP_ASSETS_URL = process.env.REACT_APP_GRAASP_ASSETS_URL;
