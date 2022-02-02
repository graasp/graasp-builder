// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-localstorage-commands';
import { ITEM_LAYOUT_MODES } from '../../src/enums';
import {
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_INFORMATION_ICON_IS_OPEN_CLASS,
  ITEM_PANEL_ID,
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../src/config/selectors';
import {
  mockGetAppListRoute,
  mockCopyItem,
  mockCopyItems,
  mockDeleteItem,
  mockGetChildren,
  mockGetItem,
  mockGetOwnItems,
  mockMoveItem,
  mockMoveItems,
  mockPostItem,
  mockEditItem,
  mockShareItem,
  mockGetMember,
  mockGetMemberBy,
  mockDeleteItems,
  mockDefaultDownloadFile,
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
  mockGetFlags,
  mockPostItemFlag,
  mockGetItemChat,
  mockPostItemChatMessage,
  mockGetAppLink,
  mockAppApiAccessToken,
  mockGetAppData,
  mockPostAppData,
  mockDeleteAppData,
  mockPatchAppData,
  mockRecycleItem,
  mockRecycleItems,
  mockGetRecycledItems,
  mockDeleteItemTag,
  mockRestoreItems,
  mockGetMembers,
  mockGetItemThumbnail,
  mockGetAvatar,
  mockPostItemThumbnail,
  mockPostAvatar,
  mockImportZip,
  mockGetCategoryTypes,
  mockGetCategories,
  mockGetItemCategories,
  mockPostItemCategory,
  mockDeleteItemCategory,
} from './server';
import './commands/item';
import './commands/navigation';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { SAMPLE_FLAGS } from '../fixtures/flags';
import { APPS_LIST } from '../fixtures/apps/apps';
import { ACCEPT_COOKIES_NAME } from '../../src/config/constants';
import {
  SAMPLE_CATEGORIES,
  SAMPLE_CATEGORY_TYPES,
} from '../fixtures/categories';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    recycledItems = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    tags = [],
    categories = SAMPLE_CATEGORIES,
    categoryTypes = SAMPLE_CATEGORY_TYPES,
    flags = SAMPLE_FLAGS,
    deleteItemError = false,
    deleteItemsError = false,
    postItemError = false,
    moveItemError = false,
    moveItemsError = false,
    copyItemError = false,
    copyItemsError = false,
    getItemError = false,
    editItemError = false,
    shareItemError = false,
    getMemberError = false,
    defaultUploadError = false,
    defaultDownloadFileError = false,
    getCurrentMemberError = false,
    postItemTagError = false,
    postItemLoginError = false,
    putItemLoginError = false,
    editMemberError = false,
    postItemFlagError = false,
    getItemChatError = false,
    recycleItemError = false,
    recycleItemsError = false,
    getRecycledItemsError = false,
    deleteItemTagError = false,
    restoreItemsError = false,
    getItemThumbnailError = false,
    getAvatarError = false,
    postItemThumbnailError = false,
    postAvatarError = false,
    importZipError = false,
    getCategoriesError = false,
    getItemCategoriesError = false,
    postItemCategoryError = false,
    deleteItemCategoryError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));
    const allItems = [...cachedItems, ...recycledItems];

    cy.setCookie('session', currentMember ? 'somecookie' : null);

    // hide cookie banner by default
    cy.setCookie(ACCEPT_COOKIES_NAME, 'true');

    mockGetAppListRoute(APPS_LIST);

    mockGetOwnItems(cachedItems);

    mockGetSharedItems({ items: cachedItems, member: currentMember });

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(allItems, deleteItemError);

    mockDeleteItems(allItems, deleteItemsError);

    mockGetItem(
      { items: cachedItems, currentMember },
      getItemError || getCurrentMemberError,
    );

    mockGetChildren({ items: cachedItems, currentMember });

    mockMoveItem(cachedItems, moveItemError);

    mockMoveItems(cachedItems, moveItemsError);

    mockCopyItem(cachedItems, copyItemError);

    mockCopyItems(cachedItems, copyItemsError);

    mockEditItem(cachedItems, editItemError);

    mockShareItem(cachedItems, shareItemError);

    mockGetMember(cachedMembers);

    mockGetMembers(cachedMembers);

    mockGetMemberBy(cachedMembers, getMemberError);

    mockUploadItem(cachedItems, defaultUploadError);

    mockDefaultDownloadFile(cachedItems, defaultDownloadFileError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockSignInRedirection();

    mockSignOut();

    mockGetItemLogin(items);

    mockPostItemLogin(items, postItemLoginError);

    mockPutItemLogin(items, putItemLoginError);

    mockGetItemMembershipsForItem(items, currentMember);

    mockGetTags(tags);

    mockGetItemTags(items);

    mockPostItemTag(items, postItemTagError);

    mockDeleteItemTag(deleteItemTagError);

    mockEditMember(members, editMemberError);

    mockEditItemMembershipForItem(items);

    mockDeleteItemMembershipForItem();

    mockGetFlags(flags);

    mockPostItemFlag(items, postItemFlagError);

    mockGetPublicItem(items);

    mockGetPublicChildren(items);

    mockGetItems({ items, currentMember });

    mockGetItemChat({ items }, getItemChatError);

    mockPostItemChatMessage();

    mockGetAppLink();

    mockAppApiAccessToken();

    mockGetAppData();

    mockPostAppData();

    mockDeleteAppData();

    mockPatchAppData();

    mockRecycleItem(items, recycleItemError);

    mockRecycleItems(items, recycleItemsError);

    mockGetRecycledItems(recycledItems, getRecycledItemsError);

    mockRestoreItems(recycledItems, restoreItemsError);

    mockGetItemThumbnail(items, getItemThumbnailError);

    mockGetAvatar(members, getAvatarError);

    mockPostItemThumbnail(postItemThumbnailError);

    mockPostAvatar(postAvatarError);

    mockImportZip(importZipError);

    mockGetCategoryTypes(categoryTypes);

    mockGetCategories(categories, getCategoriesError);

    mockGetItemCategories(items, getItemCategoriesError);

    mockPostItemCategory(postItemCategoryError);

    mockDeleteItemCategory(deleteItemCategoryError);
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

Cypress.Commands.add(
  'visitAndMockWs',
  (visitRoute, sampleData, wsClientStub) => {
    cy.setUpApi(sampleData);
    cy.visit(visitRoute, {
      onBeforeLoad: (win) => {
        cy.stub(win, 'WebSocket', () => wsClientStub);
      },
    });
  },
);

Cypress.Commands.add(
  'clickElementInIframe',
  (iframeSelector, elementSelector) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy.wrap($iframe.contents().find(elementSelector)).click(),
      ),
);

Cypress.Commands.add(
  'checkContentInElementInIframe',
  (iframeSelector, elementSelector, text) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy
          .wrap($iframe.contents().find(elementSelector))
          .should('contain', text),
      ),
);

Cypress.Commands.add('openMetadataPanel', () => {
  cy.get(`#${ITEM_PANEL_ID}`).then(($itemPanel) => {
    if (!$itemPanel.hasClass(ITEM_INFORMATION_ICON_IS_OPEN_CLASS)) {
      cy.get(`#${ITEM_INFORMATION_BUTTON_ID}`).click();
    }
  });
});
