// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-localstorage-commands';
import { ITEM_LAYOUT_MODES } from '../../src/enums';
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
  mockGetMemberBy,
  mockDeleteItems,
  mockDefaultDownloadFile,
  mockGetS3Metadata,
  mockGetS3FileContent,
  mockUploadItem,
  mockGetCurrentMember,
  mockSignInRedirection,
  mockSignOut,
  mockPostItemLogin,
  mockGetItemLogin,
  mockGetItemMembershipsForItem,
  mockGetItemTags,
  mockGetTags,
  mockPostItemTag,
  mockPutItemLogin,
  mockEditMember,
  mockGetSharedItems,
  mockEditItemMembershipForItem,
  mockDeleteItemMembershipForItem,
  mockGetPublicItem,
  mockGetPublicChildren,
  mockGetItems,
} from './server';
import './commands/item';
import './commands/navigation';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    tags = [],
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
    getS3MetadataError = false,
    getS3FileContentError = false,
    getCurrentMemberError = false,
    postItemTagError = false,
    postItemLoginError = false,
    putItemLoginError = false,
    editMemberError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));

    mockGetOwnItems(cachedItems);

    mockGetSharedItems({ items: cachedItems, member: currentMember });

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(cachedItems, deleteItemError);

    mockDeleteItems(cachedItems, deleteItemsError);

    mockGetItem(
      { items: cachedItems, currentMember },
      getItemError || getCurrentMemberError,
    );

    mockGetChildren({ items: cachedItems, currentMember });

    mockMoveItem(cachedItems, moveItemError);

    mockCopyItem(cachedItems, copyItemError);

    mockEditItem(cachedItems, editItemError);

    mockShareItem(cachedItems, shareItemError);

    mockGetMember(cachedMembers);

    mockGetMemberBy(cachedMembers, getMemberError);

    mockUploadItem(cachedItems, defaultUploadError);

    mockDefaultDownloadFile(cachedItems, defaultDownloadFileError);

    mockGetS3Metadata(cachedItems, getS3MetadataError);

    mockGetS3FileContent(getS3FileContentError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockSignInRedirection();

    mockSignOut();

    mockGetItemLogin(items);

    mockPostItemLogin(items, postItemLoginError);

    mockPutItemLogin(items, putItemLoginError);

    mockGetItemMembershipsForItem(items);

    mockGetTags(tags);

    mockGetItemTags(items);

    mockPostItemTag(items, postItemTagError);

    mockEditMember(members, editMemberError);

    mockEditItemMembershipForItem(items);

    mockDeleteItemMembershipForItem(items);

    mockGetPublicItem(items);

    mockGetPublicChildren(items);

    mockGetItems({ items, currentMember });
  },
);

Cypress.Commands.add('switchMode', (mode) => {
  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      cy.get(`#${MODE_GRID_BUTTON_ID}`).click({ force: true });
      break;
    case ITEM_LAYOUT_MODES.LIST:
      cy.get(`#${MODE_LIST_BUTTON_ID}`).click({ force: true });
      break;
    default:
      console.error(`invalid mode ${mode} provided`);
      break;
  }
});
