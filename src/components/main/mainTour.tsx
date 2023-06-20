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
          This is a short tour that will show you some of the main features. If
          you at anytime want to skip the tour, just click the skip button.
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
      content:
        'Click here to create a new item, either by uploading a file or creating it yourself. If you are inside a folder it will be added inside it.',
      disableOverlayClose: true,
      requireClick: true,
      spotlightClicks: false,
      disableBeacon: true,
      timestamp: 'now',
    },

    {
      target: `#${CREATE_ITEM_FOLDER_ID}`,
      content:
        'There is multiple different items such as: Folders, Documents, Apps, Links to other web content.',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
      clickForBackTarget: `#${ITEM_FORM_CANCEL_BUTTON_ID}`,
    },
    {
      target: `#${ITEM_FORM_NAME_INPUT_ID}`,
      content: 'When creating a Folder you will have to give it a name.',
      disableBeacon: true,
      spotlightClicks: false,
      disableOverlayClose: true,
      timestamp: 'now',
      requireTextInput: true,
      exampleTextInput: 'My new folder',
    },
    {
      target: `#${FOLDER_FORM_DESCRIPTION_ID}`,
      content: 'If you want you can add a description to it here.',
      disableBeacon: true,
      disableOverlayClose: true,
      spotlightClicks: false,
      timestamp: 'now',
      requireTextInput: true,
      textTarget: `#${FOLDER_FORM_DESCRIPTION_ID} .ql-editor > p`, // needs to change when quil editor updates
      exampleTextInput: 'My folder description',
    },
    {
      target:
        'body > div.MuiDialog-root.MuiModal-root.css-zw3mfo-MuiModal-root-MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper.css-hz1bth-MuiDialog-container > div > div.MuiDialogContent-root.css-1751eu6-MuiDialogContent-root > div.MuiBox-root.css-1vozh7r',
      content: 'Lets create your first item. Click Next when you are done',
      disableBeacon: true,
      disableOverlayClose: true,
      placement: 'bottom',
      timestamp: 'now',

      // clickTarget: `#${ITEM_FORM_CONFIRM_BUTTON_ID}`,
      // requireClick: true, // Handle how this should be when it's the last step
    },
    {
      // obs this doesn't add
      target: `#${ITEM_FORM_CONFIRM_BUTTON_ID}`,
      content: 'Click the Add button to finsih creating the item.',
      disableOverlayClose: true,
      spotlightClicks: false,
      // clickTarget: `#${ITEM_FORM_CANCEL_BUTTON_ID}`,
      // hideCloseButton: true,
      // hideFooter: true,
      disableBeacon: true,
      timestamp: 'now',
      requireClick: true,
      clickTarget: `#${ITEM_FORM_CONFIRM_BUTTON_ID}`,
    },
  ];

  const itemSteps: Step[] = [
    {
      target: 'div.ag-row-even:nth-child(1)', // TODO: get better way to pick the first item
      content:
        'The Folder is now added to you items here. When you have multiple items in the same place they will all be listed as a table here.',
      timestamp: 'now',
      itemIdPrefix: 'nameCellRenderer-',
      itemIdTarget:
        'div.ag-row-even:nth-child(1) >  div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1)',
      disableBeacon: true,
      hideBackButton: true,
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
      content:
        'For each item you can edit the name of it, download it or multiple other things.',
      timestamp: 'now',
      needsItemId: true,
    },
    {
      target: '[id^=cell-actions-] > button',
      content:
        'Here you can do things such at deleting the item, moving it or copying it.',
      timestamp: 'now',
    },
    {
      target: 'div.ag-row-even:nth-child(1)', // TODO: get better way to pick the first item
      content: 'Click the item to enter it.',
      timestamp: 'now',
      disableBeacon: true,
      clickTarget: '[id^=cell-name-]', // this is id for first row in item table TODO: get it in a better way
      requireClick: true,
    },
    {
      target: `.${ITEM_MAIN_CLASS}`, // TODO needs to have a good way to wait for target to load before moving forward.
      content:
        'Here you can change the content of your item. Since this is a folder you could, if you had items in your folder, reorder them to change the order your content is displayed. If this was a document you would be able to change the text here. And if it was an App you would be able to change the settings and the content of it here. ',
      clickForBackTarget: `#${NAVIGATION_HOME_LINK_ID}`,
      timestamp: 'now',
    },
    {
      target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Player}`,
      content: 'In Player you can view how your content looks.',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
    },
    {
      target: '.css-m69qwo-MuiStack-root > span:nth-child(1)',
      content:
        'Here you can edit the caption of the item. For some items the text edit box will appear under the item.',
      timestamp: 'now',
    },
    {
      target: '.itemMenuShareButton',
      content:
        'Here you can share the item, or current folder with other users. You can also set the viewing permissions.',
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
      content:
        'Right now you are in Builder. Here you can create documents and share them with other users among other things. ',
      disableBeacon: true,
      disableOverlayClose: true,
      timestamp: 'now',
    },
    ...createItem,
    ...itemSteps,
    {
      target: `#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Library}`,
      content:
        'In the Library you can find courses other users have published.',
      disableBeacon: true,
      disableOverlayClose: true,
      clickForBackTarget: '.itemMenuShareButton',
      timestamp: 'now',
    },
    {
      target: '.css-q9mey5', // Can't change place with profile, tour will then skip this step
      content:
        'If you need some more information you can find it here in Tutorials.',
      timestamp: 'now',
      // requireClick: true,
      // clickTarget: '.css-kxftdr',
    },
    {
      target: `#${HEADER_MEMBER_MENU_BUTTON_ID}`,
      content:
        'In the profile you can change language, set a profile picture and set a password (?). You could also redo the tour whenever you want.',
      requireClick: true,
      clickTarget: '.css-kxftdr', // TODO get better id
      timestamp: 'now',
    },
    endOfTour,
  ];

  return mainSteps;
};

// export const test = mainSteps.concat(createItem);

export const steps = constructStepsWithId;

export default steps;
