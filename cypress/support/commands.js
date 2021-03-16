// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';
import { MODES } from '../../src/config/constants';
import {
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../src/config/selectors';
import {
  mockCopyItem,
  mockDeleteItem,
  mockGetChildren,
  mockGetItem,
  mockGetOwnItems,
  mockMoveItem,
  mockPostItem,
  mockEditItem,
  mockShareItem,
  mockGetMember,
  mockDeleteItems,
  mockDefaultDownloadFile,
  mockGetS3Metadata,
  mockGetS3FileContent,
  mockUploadItem,
} from './server';
import './commands/item';
import './commands/navigation';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    members = [],
    deleteItemError = false,
    deleteItemsError = false,
    postItemError = false,
    moveItemError = false,
    copyItemError = false,
    getItemError = false,
    editItemError = false,
    shareItemError = false,
    getMemberError = false,
    defaultUploadError = false,
    defaultDownloadFileError = false,
    defaultGetS3MetadataError = false,
    defaultGetS3FileContentError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));

    mockGetOwnItems(cachedItems);

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(cachedItems, deleteItemError);

    mockDeleteItems(cachedItems, deleteItemsError);

    mockGetItem(cachedItems, getItemError);

    mockGetChildren(cachedItems);

    mockMoveItem(cachedItems, moveItemError);

    mockCopyItem(cachedItems, copyItemError);

    mockEditItem(cachedItems, editItemError);

    mockShareItem(cachedItems, shareItemError);

    mockGetMember(cachedMembers, getMemberError);

    mockUploadItem(cachedItems, defaultUploadError);

    mockDefaultDownloadFile(cachedItems, defaultDownloadFileError);

    mockGetS3Metadata(cachedItems, defaultGetS3MetadataError);

    mockGetS3FileContent(defaultGetS3FileContentError);
  },
);

Cypress.Commands.add('switchMode', (mode) => {
  switch (mode) {
    case MODES.GRID:
      cy.get(`#${MODE_GRID_BUTTON_ID}`).click({ force: true });
      break;
    case MODES.LIST:
      cy.get(`#${MODE_LIST_BUTTON_ID}`).click({ force: true });
      break;
    default:
      console.error(`invalid mode ${mode} provided`);
      break;
  }
});
