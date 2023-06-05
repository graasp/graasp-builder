import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_FOLDER_ID,
  ITEM_FORM_CANCEL_BUTTON_ID,
} from '../../config/selectors';

const navigationSteps = [
  {
    // first step of tour have all the settings
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_ID}`,
    content: 'Start of tour info ',
    disableBeacon: true,
    disableOverlayClose: true,
    timestamp: 'now',
  },
  {
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Builder}`,
    content: 'Builder Info',
    disableBeacon: true,
    disableOverlayClose: true,
    timestamp: 'now',
  },
  {
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Player}`,
    content: 'Player Info',
    disableBeacon: true,
    disableOverlayClose: true,
    timestamp: 'now',
  },
  {
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Library}`,
    content: 'Library Info',
    disableBeacon: true,
    disableOverlayClose: true,
    timestamp: 'now',
  },
];

const createItem = [
  {
    target: `#${CREATE_ITEM_BUTTON_ID}`,
    content: 'Create Item info',
    disableOverlayClose: true,
    // hideCloseButton: true,
    // hideFooter: true,
    requireClick: true,
    disableBeacon: true,
    timestamp: 'now',
  },

  {
    target: `#${CREATE_ITEM_FOLDER_ID}`,
    content: 'folder info',
    disableBeacon: true,
    disableOverlayClose: true,
    timestamp: 'now',
    clickForBackId: { ITEM_FORM_CANCEL_BUTTON_ID },
  },
];

export const steps = navigationSteps.concat(createItem);

export default steps;
