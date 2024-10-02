import { CookieKeys, PublicationStatus } from '@graasp/sdk';

import 'cypress-localstorage-commands';

import { ItemLayoutMode } from '@/enums';

import { LAYOUT_MODE_BUTTON_ID } from '../../src/config/selectors';
import { APPS_LIST } from '../fixtures/apps/apps';
import { SAMPLE_CATEGORIES } from '../fixtures/categories';
import { SAMPLE_MENTIONS } from '../fixtures/chatbox';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
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
  mockDeleteItemMembershipForItem,
  mockDeleteItemTag,
  mockDeleteItemThumbnail,
  mockDeleteItems,
  mockDeleteShortLink,
  mockDownloadItemChat,
  mockEditItem,
  mockEditItemMembershipForItem,
  mockEditMember,
  mockEnroll,
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
  mockGetItemValidationGroups,
  mockGetItems,
  mockGetItemsTags,
  mockGetLatestValidationGroup,
  mockGetLinkMetadata,
  mockGetManyPublishItemInformations,
  mockGetMember,
  mockGetMemberMentions,
  mockGetMembers,
  mockGetMembersBy,
  mockGetMembershipRequestsForItem,
  mockGetOwnMembershipRequests,
  mockGetOwnRecycledItemData,
  mockGetParents,
  mockGetPublicationStatus,
  mockGetPublishItemInformations,
  mockGetPublishItemsForMember,
  mockGetShortLinksItem,
  mockImportH5p,
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
  mockRejectMembershipRequest,
  mockRequestMembership,
  mockRestoreItems,
  mockSignInRedirection,
  mockSignOut,
  mockUnpublishItem,
  mockUpdatePassword,
  mockUploadInvitationCSV,
  mockUploadItem,
} from './server';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    recycledItemData = [],
    bookmarkedItems = [],
    publishedItemData = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    mentions = SAMPLE_MENTIONS,
    categories = SAMPLE_CATEGORIES,
    itemValidationGroups = [],
    itemPublicationStatus = PublicationStatus.Unpublished,
    membershipRequests = [],
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
    importH5pError = false,
    getRecycledItemsError = false,
    getPublishedItemsError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));
    const allItems = [...cachedItems];

    const cachedShortLinks = JSON.parse(JSON.stringify(shortLinks));

    // hide cookie banner by default
    cy.setCookie(CookieKeys.AcceptCookies, 'true');

    mockGetAppListRoute(APPS_LIST);

    mockGetAccessibleItems(cachedItems);

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

    mockGetOwnRecycledItemData(recycledItemData, getRecycledItemsError);

    mockRestoreItems(items, restoreItemsError);

    // mockGetItemThumbnail(items, getItemThumbnailError);
    mockGetItemThumbnailUrl(items, getItemThumbnailError);

    mockDeleteItemThumbnail(items, getItemThumbnailError);

    mockGetAvatarUrl(members, getAvatarUrlError);

    mockPostItemThumbnail(items, postItemThumbnailError);

    mockPostAvatar(postAvatarError);

    mockImportZip(importZipError);

    mockGetCategories(categories, getCategoriesError);

    mockGetItemCategories(items, getItemCategoriesError);

    mockPostItemCategory(postItemCategoryError);

    mockDeleteItemCategory(deleteItemCategoryError);

    mockGetItemValidationGroups(itemValidationGroups);

    mockPostItemValidation();

    mockPostInvitations(items, postInvitationsError);

    mockGetItemInvitations(items, getItemInvitationsError);

    mockPatchInvitation(items, patchInvitationError);

    mockDeleteInvitation(items, deleteInvitationError);

    mockUploadInvitationCSV(items, false);

    mockGetPublicationStatus(itemPublicationStatus);
    mockPublishItem(items);
    mockUnpublishItem(items);

    mockGetPublishItemInformations(items);

    mockGetManyPublishItemInformations(items);

    mockGetLatestValidationGroup(items, itemValidationGroups);

    mockUpdatePassword(members, updatePasswordError);

    mockGetItemFavorites(bookmarkedItems, getFavoriteError);

    mockAddFavorite(cachedItems, addFavoriteError);

    mockDeleteFavorite(deleteFavoriteError);

    mockGetShortLinksItem(itemId, cachedShortLinks, getShortLinksItemError);

    mockCheckShortLink(getShortLinkAvailable);

    mockPostShortLink(cachedShortLinks, postShortLinkError);

    mockPatchShortLink(cachedShortLinks, patchShortLinkError);

    mockDeleteShortLink(cachedShortLinks, deleteShortLinkError);

    mockGetLinkMetadata();

    mockImportH5p(importH5pError);

    mockGetPublishItemsForMember(publishedItemData, getPublishedItemsError);

    mockGetOwnMembershipRequests(currentMember, membershipRequests);

    mockRequestMembership();

    mockGetMembershipRequestsForItem(membershipRequests);

    mockRejectMembershipRequest();

    mockEnroll();
  },
);

Cypress.Commands.add('switchMode', (mode) => {
  cy.get(`#${LAYOUT_MODE_BUTTON_ID}`).click({ force: true });
  switch (mode) {
    case ItemLayoutMode.Grid:
      cy.get(`li[value="${ItemLayoutMode.Grid}"]`).click({ force: true });
      break;
    case ItemLayoutMode.List:
      cy.get(`li[value="${ItemLayoutMode.List}"]`).click({ force: true });
      break;
    case ItemLayoutMode.Map:
      cy.get(`li[value="${ItemLayoutMode.Map}"]`).click({ force: true });
      break;
    default:
      throw new Error(`invalid mode ${mode} provided`);
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

Cypress.Commands.add('attachFile', (selector, file, options = {}) => {
  selector.selectFile(`cypress/fixtures/${file}`, options);
});

Cypress.Commands.add('attachFiles', (selector, filenames, options = {}) => {
  const correctFilenames = filenames.map(
    (filename) => `cypress/fixtures/${filename}`,
  );
  selector.selectFile(correctFilenames, options);
});
