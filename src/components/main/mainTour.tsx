import { ChangeEvent } from 'react';
import { Step as JoyrideStep } from 'react-joyride';

import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_FOLDER_ID,
  FOLDER_FORM_DESCRIPTION_ID,
  HEADER_MEMBER_MENU_BUTTON_ID,
  ITEM_FORM_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_MAIN_CLASS,
  NAVIGATION_HOME_LINK_ID,
  OWNED_ITEMS_ID, // buildItemsTableRowId,
} from '../../config/selectors';

export type Step = JoyrideStep & {
  target: string;
  buildId?: (id: string) => string;
  timestamp: string;
  requireClick?: boolean;
  clickForBackTarget?: string;
  requireTextInput?: true;
  exampleTextInput?: string;
  textTarget?: string;
  onTextChange?:
    | ((content: string) => void)
    | ((event: ChangeEvent<{ value: string }>) => void);
  focusModal?: boolean;
  needsItemId?: boolean;
  itemIdPrefix?: string;
  clickTarget?: string;
  numberOfItems?: number;
  parent?: string;
  shouldIncrease?: boolean;
  itemIdTarget?: string;
};

export const constructStepsWithId = (id: string): Step[] => {
  console.log(id);
  const startOfTour: Step = {
    target: 'body',
    content: (
      <div>
        <h2>Welcome to Graasp</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pulvinar
          sapien et lacus pellentesque, et iaculis enim ultrices. Ut venenatis
          tempus luctus. In sit amet lorem sit amet tortor fringilla tristique
          eu id ipsum. Curabitur dignissim eleifend augue, sed dapibus justo
          vestibulum vel.
        </p>
      </div>
    ),
    disableOverlayClose: true,
    timestamp: 'now',
    disableBeacon: true,
    placement: 'center' as const,
  };

  const endOfTour: Step = {
    target: 'body',
    content: 'End of tour',
    disableOverlayClose: true,
    timestamp: 'now',
    clickForBackTarget: `#${HEADER_MEMBER_MENU_BUTTON_ID}`, // this is id for first row in item table TODO: get it in a better way,
    disableBeacon: true,
    placement: 'center' as const,
  };

  const createItem: Step[] = [
    // TODO, the stemps in the modal loses keyboard focus, so it's not possible to continue tour with keyboard!!
    {
      target: `#${CREATE_ITEM_BUTTON_ID}`,
      content: 'Create Item info',
      disableOverlayClose: true,
      requireClick: true,
      spotlightClicks: false,
      disableBeacon: true,
      timestamp: 'now',
    },

    {
      target: `#${CREATE_ITEM_FOLDER_ID}`,
      content: 'folder info',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
      clickForBackTarget: `#${ITEM_FORM_CANCEL_BUTTON_ID}`,
    },
    {
      target: `#${ITEM_FORM_NAME_INPUT_ID}`,
      content: 'name info',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
      requireTextInput: true,
      exampleTextInput: 'My new folder',
    },
    {
      target: `#${FOLDER_FORM_DESCRIPTION_ID}`,
      content: 'description info',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
      requireTextInput: true,
      textTarget: `#${FOLDER_FORM_DESCRIPTION_ID} .ql-editor > p`, // needs to change when quil editor updates
      exampleTextInput: 'My folder description',
    },
    {
      // obs this doesn't add
      target: `#${ITEM_FORM_CONFIRM_BUTTON_ID}`,
      content: 'Add button info',
      disableOverlayClose: true,
      spotlightClicks: false,
      // clickTarget: `#${ITEM_FORM_CANCEL_BUTTON_ID}`,
      // hideCloseButton: true,
      // hideFooter: true,
      requireClick: true, // Handle how this should be when it's the last step
      disableBeacon: true,
      timestamp: 'now',
    },
  ];

  const itemSteps: Step[] = [
    {
      target: 'div.ag-row-even:nth-child(1)', // TODO: get better way to pick the first item
      content: 'your item',
      timestamp: 'now',
      itemIdPrefix: 'nameCellRenderer-',
      itemIdTarget:
        'div.ag-row-even:nth-child(1) >  div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1)',
      disableBeacon: true,
      parent: `#${OWNED_ITEMS_ID}`,
      shouldIncrease: true,
      clickForBackTarget: `#${CREATE_ITEM_BUTTON_ID}`, // TODO: would make more sense if this is added to the actual step and not the one after
    },
    /* {
      target: buildItemsTableRowId(id),
      content: 'item info',
      timestamp: 'now',
      needsItemId: true,
    }, */
    {
      target: '[id^=cell-actions-]', // will find the first one matching, not super reliable.
      content: 'item info',
      timestamp: 'now',
      needsItemId: true,
    },
    {
      target: '[id^=cell-actions-] > button',
      content: 'item info',
      timestamp: 'now',
    },
    {
      target: 'div.ag-row-even:nth-child(1)', // TODO: get better way to pick the first item
      content: 'your item',
      timestamp: 'now',
      disableBeacon: true,
      clickTarget: '[id^=cell-name-]', // this is id for first row in item table TODO: get it in a better way
      requireClick: true,
    },
    {
      target: `.${ITEM_MAIN_CLASS}`, // TODO needs to have a good way to wait for target to load before moving forward.
      content: 'item info',
      clickForBackTarget: `#${NAVIGATION_HOME_LINK_ID}`,
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
      target: '.css-m69qwo-MuiStack-root > span:nth-child(1)',
      content: 'edit item',
      timestamp: 'now',
    },
    {
      target: '.itemMenuShareButton',
      content: 'share item',
      timestamp: 'now',
      requireClick: true,
    },
    {
      target: '.MuiContainer-root',
      content: 'share info',
      clickForBackTarget: '.itemMenuShareButton',
      isFixed: true,
      timestamp: 'now',
    },
    {
      target: 'li.MuiListItem-root:nth-child(2)',
      content: 'share info',
      clickTarget: '.itemMenuShareButton',
      requireClick: true,
      timestamp: 'now',
    },
  ];

  const mainSteps: Step[] = [
    startOfTour,
    {
      target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Builder}`,
      content: 'Builder Info',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
    },
    ...createItem,
    ...itemSteps,
    {
      target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Library}`,
      content: 'Library Info',
      disableBeacon: true,
      disableOverlayClose: true,
      clickForBackTarget: '.itemMenuShareButton',
      timestamp: 'now',
    },
    {
      target: '.css-q9mey5',
      content: 'Tutorial info',
      timestamp: 'now',
      // requireClick: true,
      // clickTarget: '.css-kxftdr',
    },
    {
      target: `#${HEADER_MEMBER_MENU_BUTTON_ID}`,
      content: 'profile info',
      requireClick: true,
      clickTarget: '.css-kxftdr',
      timestamp: 'now',
    },
    endOfTour,
  ];

  return mainSteps;
};

// export const test = mainSteps.concat(createItem);

export const steps = constructStepsWithId;

export default steps;
