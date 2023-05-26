import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_FOLDER_ID,
} from '../../config/selectors';

const navigationSteps = [
  {
    // first step of tour have all the settings
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_ID}`,
    content: 'Start of tour info ',
    disableBeacon: true,
    timestamp: 'now',
  },
  {
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Builder}`,
    content: 'Builder Info',
    timestamp: 'now',
  },
  {
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Player}`,
    content: 'Player Info',
    timestamp: 'now',
  },
  {
    target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Library}`,
    content: 'Library Info',
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
    spotlightClicks: true,
    timestamp: 'now',
  },

  {
    target: `#${CREATE_ITEM_FOLDER_ID}`,
    content: 'folder info',
    timestamp: 'now',
  },
];

export const steps = navigationSteps.concat(createItem);

export default steps;
