// eslint-disable-next-line import/no-extraneous-dependencies
import { COOKIE_KEYS } from '@graasp/sdk';

import 'cypress-localstorage-commands';

import { DEFAULT_ITEM_LAYOUT_MODE } from '../../src/config/constants';
import {
  ITEM_INFORMATION_BUTTON_ID,
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../src/enums/itemLayoutModes';
import { APPS_LIST } from '../fixtures/apps/apps';
import { SAMPLE_CATEGORIES } from '../fixtures/categories';
import { SAMPLE_MENTIONS } from '../fixtures/chatbox';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { ITEM_VALIDATION_AND_REVIEW } from '../fixtures/validations';
import './commands/item';
import './commands/navigation';
import {
  mockAddFavorite,
  mockAppApiAccessToken,
  mockCheckShortLink,
  mockClearItemChat,
  mockCopyItems,
  mockDefaultDownloadFile,
  mockDeleteAppData,
  mockDeleteFavorite,
  mockDeleteInvitation,
  mockDeleteItemCategory,
  mockDeleteItemLoginSchemaRoute,
  mockDeleteItemMembershipForItem,
  mockDeleteItemTag,
  mockDeleteItems,
  mockDeleteShortLink,
  mockDownloadItemChat,
  mockEditItem,
  mockEditItemMembershipForItem,
  mockEditMember,
  mockGetAccessibleItems,
  mockGetAppData,
  mockGetAppLink,
  mockGetAppListRoute,
  mockGetAvatarUrl,
  mockGetCategories,
  mockGetChildren,
  mockGetCurrentMember,
  mockGetItem,
  mockGetItemCategories,
  mockGetItemChat,
  mockGetItemFavorites,
  mockGetItemInvitations,
  mockGetItemLoginSchema,
  mockGetItemLoginSchemaType,
  mockGetItemMembershipsForItem,
  mockGetItemTags,
  mockGetItemThumbnailUrl,
  mockGetItemValidationAndReview,
  mockGetItemValidationGroups,
  mockGetItems,
  mockGetItemsTags,
  mockGetLatestValidationGroup,
  mockGetManyPublishItemInformations,
  mockGetMember,
  mockGetMemberMentions,
  mockGetMembers,
  mockGetMembersBy,
  mockGetOwnItems,
  mockGetParents,
  mockGetPublishItemInformations,
  mockGetRecycledItems,
  mockGetSharedItems,
  mockGetShortLinksItem,
  mockImportZip,
  mockMoveItems,
  mockPatchAppData,
  mockPatchInvitation,
  mockPatchShortLink,
  mockPostAppData,
  mockPostAvatar,
  mockPostInvitations,
  mockPostItem,
  mockPostItemCategory,
  mockPostItemChatMessage,
  mockPostItemFlag,
  mockPostItemLogin,
  mockPostItemMembership,
  mockPostItemTag,
  mockPostItemThumbnail,
  mockPostItemValidation,
  mockPostManyItemMemberships,
  mockPostShortLink,
  mockPublishItem,
  mockPutItemLoginSchema,
  mockRecycleItems,
  mockRestoreItems,
  mockSignInRedirection,
  mockSignOut,
  mockUnpublishItem,
  mockUpdatePassword,
  mockUploadItem,
} from './server';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    recycledItemData = [],
    favoriteItems = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    mentions = SAMPLE_MENTIONS,
    categories = SAMPLE_CATEGORIES,
    itemValidationAndReview = ITEM_VALIDATION_AND_REVIEW,
    itemValidationGroups = [],
    deleteItemsError = false,
    postItemError = false,
    moveItemsError = false,
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
    deleteItemTagError = false,
    restoreItemsError = false,
    getItemThumbnailError = false,
    getAvatarUrlError = false,
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
    postItemChatMessageError = false,
    clearItemChatError = false,
    getMemberMentionsError = false,
    getAppLinkError = false,
    appApiAccessTokenError = false,
    getAppDataError = false,
    postAppDataError = false,
    patchAppDataError = false,
    deleteAppDataError = false,
    getFavoriteError = false,
    addFavoriteError = false,
    deleteFavoriteError = false,
    itemId,
    shortLinks = [],
    getShortLinksItemError = false,
    getShortLinkAvailable = true,
    postShortLinkError = false,
    patchShortLinkError = false,
    deleteShortLinkError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));
    const allItems = [...cachedItems];

    const cachedShortLinks = JSON.parse(JSON.stringify(shortLinks));

    // hide cookie banner by default
    cy.setCookie(COOKIE_KEYS.ACCEPT_COOKIES_KEY, 'true');

    mockGetAppListRoute(APPS_LIST);

    mockGetAccessibleItems(cachedItems);

    mockGetOwnItems(cachedItems);

    mockGetSharedItems({ items: cachedItems, member: currentMember });

    mockPostItem(cachedItems, postItemError);

    mockDeleteItems(allItems, deleteItemsError);

    mockGetItem(
      { items: cachedItems, currentMember },
      getItemError || getCurrentMemberError,
    );
    mockGetParents({ items, currentMember });
    mockGetChildren({ items: cachedItems, currentMember });

    mockMoveItems(cachedItems, moveItemsError);

    mockCopyItems(cachedItems, copyItemsError);

    mockEditItem(cachedItems, editItemError);

    mockPostItemMembership(cachedItems, shareItemError);
    mockPostManyItemMemberships(
      { items: cachedItems, members },
      shareItemError,
    );

    mockGetMember(cachedMembers);

    mockGetMembers(cachedMembers);

    mockGetMembersBy(cachedMembers, getMemberError);

    mockUploadItem(cachedItems, defaultUploadError);

    mockDefaultDownloadFile(cachedItems, defaultDownloadFileError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockSignInRedirection();

    mockSignOut();

    // mockGetItemLogin(items);

    mockGetItemLoginSchema(items);

    mockGetItemLoginSchemaType(items);

    mockPostItemLogin(cachedItems, postItemLoginError);

    mockPutItemLoginSchema(cachedItems, putItemLoginError);

    mockGetItemMembershipsForItem(items, currentMember);

    mockGetItemTags(items);

    mockGetItemsTags(items);

    mockPostItemTag(cachedItems, currentMember, postItemTagError);

    mockDeleteItemTag(deleteItemTagError);

    mockEditMember(members, editMemberError);

    mockEditItemMembershipForItem();

    mockDeleteItemMembershipForItem();

    mockPostItemFlag(cachedItems, postItemFlagError);

    mockGetItems({ items, currentMember });

    mockGetItemChat({ items }, getItemChatError);

    mockDownloadItemChat({ items }, getItemChatError);

    mockPostItemChatMessage(postItemChatMessageError);

    mockClearItemChat({ items }, clearItemChatError);

    mockGetMemberMentions({ mentions }, getMemberMentionsError);

    mockGetAppLink(getAppLinkError);

    mockAppApiAccessToken(appApiAccessTokenError);

    mockGetAppData(getAppDataError);

    mockPostAppData(postAppDataError);

    mockDeleteAppData(deleteAppDataError);

    mockPatchAppData(patchAppDataError);

    mockRecycleItems(items, recycleItemsError);

    mockGetRecycledItems(recycledItemData);

    mockRestoreItems(recycledItemData, restoreItemsError);

    // mockGetItemThumbnail(items, getItemThumbnailError);
    mockGetItemThumbnailUrl(items, getItemThumbnailError);

    mockGetAvatarUrl(members, getAvatarUrlError);

    mockPostItemThumbnail(items, postItemThumbnailError);

    mockPostAvatar(postAvatarError);

    mockImportZip(importZipError);

    mockGetCategories(categories, getCategoriesError);

    mockGetItemCategories(items, getItemCategoriesError);

    mockPostItemCategory(postItemCategoryError);

    mockDeleteItemCategory(deleteItemCategoryError);

    mockGetItemValidationAndReview(itemValidationAndReview);

    mockGetItemValidationGroups(itemValidationGroups);

    mockPostItemValidation();

    mockPostInvitations(items, postInvitationsError);

    mockGetItemInvitations(items, getItemInvitationsError);

    mockPatchInvitation(items, patchInvitationError);

    mockDeleteInvitation(items, deleteInvitationError);

    mockPublishItem(items);
    mockUnpublishItem(items);

    mockGetPublishItemInformations(items);

    mockGetManyPublishItemInformations(items);

    mockGetLatestValidationGroup(items, itemValidationGroups);

    mockUpdatePassword(members, updatePasswordError);

    mockDeleteItemLoginSchemaRoute(items);

    mockGetItemFavorites(favoriteItems, getFavoriteError);

    mockAddFavorite(cachedItems, addFavoriteError);

    mockDeleteFavorite(deleteFavoriteError);

    mockGetShortLinksItem(itemId, cachedShortLinks, getShortLinksItemError);

    mockCheckShortLink(getShortLinkAvailable);

    mockPostShortLink(cachedShortLinks, postShortLinkError);

    mockPatchShortLink(cachedShortLinks, patchShortLinkError);

    mockDeleteShortLink(cachedShortLinks, deleteShortLinkError);
  },
);

Cypress.Commands.add('switchMode', (mode) => {
  if (DEFAULT_ITEM_LAYOUT_MODE !== mode) {
    switch (mode) {
      case ITEM_LAYOUT_MODES.GRID:
        cy.get(`#${MODE_GRID_BUTTON_ID}`).click({ force: true });
        break;
      case ITEM_LAYOUT_MODES.LIST:
        cy.get(`#${MODE_LIST_BUTTON_ID}`).click({ force: true });
        // todo: this wait is here to ensure the table has time to stabilize.
        // this wait should be removed as soon as the table is not using ag-grid anymore.
        // this is due to multiple re-rendering caused by how we handle the table. This should be fixed.
        // using waits in not a solution.
        cy.wait(2000);
        break;
      default:
        console.error(`invalid mode ${mode} provided`);
        break;
    }
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
  cy.get(`#${ITEM_INFORMATION_BUTTON_ID}`).click();
});

Cypress.Commands.add('attachFile', (selector, file, options = {}) => {
  selector.selectFile(`cypress/fixtures/${file}`, options);
});

Cypress.Commands.add('attachFiles', (selector, filenames, options = {}) => {
  const correctFilenames = filenames.map(
    (filename) => `cypress/fixtures/${filename}`,
  );
  selector.selectFile(correctFilenames, options);
});
