// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-localstorage-commands';
import { COOKIE_KEYS } from '@graasp/sdk';
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
  mockPostItemMembership,
  mockGetMember,
  mockGetMembersBy,
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
  mockGetItemValidationAndReview,
  mockGetItemValidationStatuses,
  mockGetItemValidationReviewStatuses,
  mockPostItemValidation,
  mockGetItemValidationGroups,
  mockPostInvitations,
  mockGetItemInvitations,
  mockPatchInvitation,
  mockDeleteInvitation,
  mockPublishItem,
  mockUpdatePassword,
  mockPostManyItemMemberships,
  mockGetMemberMentions,
} from './server';
import './commands/item';
import './commands/navigation';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { SAMPLE_FLAGS } from '../fixtures/flags';
import { APPS_LIST } from '../fixtures/apps/apps';
import {
  SAMPLE_CATEGORIES,
  SAMPLE_CATEGORY_TYPES,
} from '../fixtures/categories';
import {
  ITEM_VALIDATION_AND_REVIEW,
  ITEM_VALIDATION_GROUPS,
  SAMPLE_STATUSES,
} from '../fixtures/validations';
import { SAMPLE_MENTIONS } from '../fixtures/chatbox';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    recycledItems = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    mentions = SAMPLE_MENTIONS,
    storedSessions = [],
    tags = [],
    categories = SAMPLE_CATEGORIES,
    categoryTypes = SAMPLE_CATEGORY_TYPES,
    flags = SAMPLE_FLAGS,
    statuses = SAMPLE_STATUSES,
    itemValidationAndReview = ITEM_VALIDATION_AND_REVIEW,
    itemValidationGroups = ITEM_VALIDATION_GROUPS,
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
    postInvitationsError = false,
    getItemInvitationsError = false,
    patchInvitationError = false,
    deleteInvitationError = false,
    updatePasswordError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));
    const allItems = [...cachedItems, ...recycledItems];

    cy.setCookie(COOKIE_KEYS.SESSION_KEY, currentMember ? 'somecookie' : null);
    cy.setCookie(
      COOKIE_KEYS.STORED_SESSIONS_KEY,
      JSON.stringify(storedSessions),
    );

    // hide cookie banner by default
    cy.setCookie(COOKIE_KEYS.ACCEPT_COOKIES_KEY, 'true');

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

    mockPostItemMembership(cachedItems, shareItemError);
    mockPostManyItemMemberships(cachedItems, shareItemError);

    mockGetMember(cachedMembers);

    mockGetMembers(cachedMembers);

    mockGetMembersBy(cachedMembers, getMemberError);

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

    mockGetMemberMentions({ mentions });

    mockGetAppLink();

    mockAppApiAccessToken();

    mockGetAppData();

    mockPostAppData();

    mockDeleteAppData();

    mockPatchAppData();

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

    mockGetItemValidationStatuses(statuses);

    mockGetItemValidationReviewStatuses(statuses);

    mockGetItemValidationAndReview(itemValidationAndReview);

    mockGetItemValidationGroups(itemValidationGroups);

    mockPostItemValidation();

    mockPostInvitations(items, postInvitationsError);

    mockGetItemInvitations(items, getItemInvitationsError);

    mockPatchInvitation(items, patchInvitationError);

    mockDeleteInvitation(items, deleteInvitationError);

    mockPublishItem(items);

    mockUpdatePassword(members, updatePasswordError);
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
