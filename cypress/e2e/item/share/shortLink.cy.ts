import {
  Context,
  PackedFolderItemFactory,
  PermissionLevel,
  ShortLink,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';

import { buildItemPath } from '@/config/paths';
import {
  SHORT_LINK_ALIAS_INPUT_ID,
  SHORT_LINK_COMPONENT,
  SHORT_LINK_MENU_START_ID,
  SHORT_LINK_RANDOMIZE_BUTTON_ID,
  SHORT_LINK_SAVE_BUTTON_ID,
  SHORT_LINK_SHORTEN_START_ID,
  buildShareButtonId,
  buildShortLinkConfirmDeleteBtnId,
  buildShortLinkDeleteBtnId,
  buildShortLinkEditBtnId,
  buildShortLinkMenuBtnId,
  buildShortLinkShortenBtnId,
} from '@/config/selectors';

import { PUBLISHED_ITEM } from '../../../fixtures/items';
import {
  expectNumberOfShortLinks,
  expectShortLinksEquals,
} from '../../../fixtures/shortLinks';

const items = [PackedFolderItemFactory(), PackedFolderItemFactory()];

describe('Short links', () => {
  describe('Admin permission', () => {
    describe('Successful POST', () => {
      let itemId: string;
      beforeEach(() => {
        const shortLinks: ShortLink[] = [];

        itemId = items[1].id;

        cy.setUpApi({
          items,
          getShortLinkAvailable: true, // indicates that the short link is available
          shortLinks,
          itemId,
        });
      });

      it('Add default short link', () => {
        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        // there is no shortlinks for the moment
        expectNumberOfShortLinks(0);

        // but because the shortlinks "replace" the link,
        // there is one link per platform
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(
          `#${buildShortLinkShortenBtnId(itemId, Context.Player)}`,
        ).click();

        cy.wait('@checkShortLink').then(
          ({
            response: { statusCode: checkStatusCode, body: availableBody },
          }) => {
            expect(checkStatusCode).equals(StatusCodes.OK);
            expect(availableBody.available).equals(true);
          },
        );
        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).click();

        cy.wait('@postShortLink').then(
          ({ response: { statusCode: postCode, body: postBody } }) => {
            expect(postCode).equals(StatusCodes.OK);
            expect(postBody.platform).equals(Context.Player);
          },
        );

        expectNumberOfShortLinks(1);
      });

      it('Add a custom short link', () => {
        const SHORT_LINK_ALIAS = 'test-1';
        const SHORT_LINK_PLATFORM = Context.Player;

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        // there is no shortlinks for the moment
        expectNumberOfShortLinks(0);

        // but because the shortlinks "replace" the link,
        // there is one link per platform
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(
          `#${buildShortLinkShortenBtnId(itemId, Context.Player)}`,
        ).click();

        cy.wait('@checkShortLink').then(
          ({
            response: { statusCode: checkStatusCode, body: availableBody },
          }) => {
            expect(checkStatusCode).equals(StatusCodes.OK);
            expect(availableBody.available).equals(true);
          },
        );

        cy.get(`#${SHORT_LINK_ALIAS_INPUT_ID}`).clear().type(SHORT_LINK_ALIAS);
        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).click();

        cy.wait('@postShortLink').then(
          ({ response: { statusCode: postCode, body: postBody } }) => {
            expect(postCode).equals(StatusCodes.OK);
            expect(postBody.platform).equals(SHORT_LINK_PLATFORM);
            expect(postBody.alias).equals(SHORT_LINK_ALIAS);
          },
        );
        expectNumberOfShortLinks(1);
      });
    });

    describe('Successful PATCH and DELETE', () => {
      let itemId: string;
      let shortLinks: ShortLink[];
      beforeEach(() => {
        itemId = items[1].id;

        shortLinks = [
          {
            alias: 'test-1',
            platform: Context.Player,
            itemId,
          },
          {
            alias: 'test-2',
            platform: Context.Builder,
            itemId,
          },
        ];

        cy.setUpApi({
          items,
          getShortLinkAvailable: true, // indicates that the short link is available
          shortLinks,
          itemId,
        });
      });

      it('Patch short link', () => {
        const NEW_SHORT_LINK = 'test-10';
        const PATCH_ALIAS = shortLinks[0].alias;

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(PATCH_ALIAS)}`).click();
        cy.get(`#${buildShortLinkEditBtnId(PATCH_ALIAS)}`).click();

        cy.get(`#${SHORT_LINK_ALIAS_INPUT_ID}`).clear().type(NEW_SHORT_LINK);

        cy.wait('@checkShortLink').then(
          ({
            response: { statusCode: checkStatusCode, body: availableBody },
          }) => {
            expect(checkStatusCode).equals(StatusCodes.OK);
            expect(availableBody.available).equals(true);
          },
        );

        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).click();

        cy.wait('@patchShortLink').then(
          ({ response: { statusCode: postCode, body: postBody } }) => {
            expect(postCode).equals(StatusCodes.OK);
            expect(postBody.alias).equals(NEW_SHORT_LINK);
          },
        );

        expectShortLinksEquals([NEW_SHORT_LINK, shortLinks[1].alias]);
      });

      it('Patch short link with random alias', () => {
        const PATCH_ALIAS = shortLinks[0].alias;

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(PATCH_ALIAS)}`).click();
        cy.get(`#${buildShortLinkEditBtnId(PATCH_ALIAS)}`).click();

        cy.get(`#${SHORT_LINK_RANDOMIZE_BUTTON_ID}`).click();

        cy.wait('@checkShortLink').then(
          ({
            response: { statusCode: checkStatusCode, body: availableBody },
          }) => {
            expect(checkStatusCode).equals(StatusCodes.OK);
            expect(availableBody.available).equals(true);
          },
        );

        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).click();

        cy.wait('@patchShortLink').then(
          ({ response: { statusCode: postCode, body: postBody } }) => {
            expect(postCode).equals(StatusCodes.OK);
            expect(postBody.alias).not.equals(PATCH_ALIAS);

            const randomAlias = postBody.alias;

            // We are checking the shortlinks here to have access to the random alias.
            expectShortLinksEquals([randomAlias, shortLinks[1].alias]);
          },
        );
      });

      it('Delete short link', () => {
        const DELETE_ALIAS = shortLinks[0].alias;
        const KEEP_SHORT_LINK = shortLinks[1];

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(DELETE_ALIAS)}`).click();
        cy.get(`#${buildShortLinkDeleteBtnId(DELETE_ALIAS)}`).click();

        cy.get(`#${buildShortLinkConfirmDeleteBtnId(DELETE_ALIAS)}`).click();

        cy.wait('@deleteShortLink').then(
          ({ response: { statusCode: postCode, body: postBody } }) => {
            expect(postCode).equals(StatusCodes.OK);
            expect(postBody.alias).equals(DELETE_ALIAS);
          },
        );

        expectShortLinksEquals([KEEP_SHORT_LINK.alias]);
      });
    });

    describe('Invalid PATCH', () => {
      let itemId: string;
      let shortLinks: ShortLink[];
      let patchAlias: string;

      beforeEach(() => {
        itemId = items[1].id;

        shortLinks = [
          {
            alias: 'test-1',
            platform: Context.Player,
            itemId,
          },
          {
            alias: 'test-2',
            platform: Context.Builder,
            itemId,
          },
        ];

        patchAlias = shortLinks[0].alias;

        cy.setUpApi({
          items,
          getShortLinkAvailable: false, // indicates that the short link is not available
          shortLinks,
          itemId,
        });
      });

      it('Edit short link empty alias', () => {
        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(patchAlias)}`).click();
        cy.get(`#${buildShortLinkEditBtnId(patchAlias)}`).click();

        cy.get(`#${SHORT_LINK_ALIAS_INPUT_ID}`).clear();

        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).should('be.disabled');
      });

      it('Edit short link too few chars', () => {
        const NEW_SHORT_LINK = 'test';

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(patchAlias)}`).click();
        cy.get(`#${buildShortLinkEditBtnId(patchAlias)}`).click();

        cy.get(`#${SHORT_LINK_ALIAS_INPUT_ID}`).clear().type(NEW_SHORT_LINK);

        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).should('be.disabled');
      });

      it('Edit short link invalid chars', () => {
        const NEW_SHORT_LINK = 'test-1$2';

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(patchAlias)}`).click();
        cy.get(`#${buildShortLinkEditBtnId(patchAlias)}`).click();

        cy.get(`#${SHORT_LINK_ALIAS_INPUT_ID}`).clear().type(NEW_SHORT_LINK);

        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).should('be.disabled');
      });

      it('Edit short link already exist', () => {
        const NEW_SHORT_LINK = 'test-2';

        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        expectNumberOfShortLinks(2);
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
        cy.get(`#${buildShortLinkMenuBtnId(patchAlias)}`).click();
        cy.get(`#${buildShortLinkEditBtnId(patchAlias)}`).click();

        cy.get(`#${SHORT_LINK_ALIAS_INPUT_ID}`).clear().type(NEW_SHORT_LINK);

        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).should('be.disabled');
      });
    });

    describe('Published Item', () => {
      let itemId: string;
      beforeEach(() => {
        const shortLinks: ShortLink[] = [];

        itemId = PUBLISHED_ITEM.id;

        cy.setUpApi({
          items: [PUBLISHED_ITEM],
          getShortLinkAvailable: true, // indicates that the short link is available
          shortLinks,
          itemId,
        });
      });

      it('POST Library short link', () => {
        cy.visit(buildItemPath(itemId));
        cy.get(`#${buildShareButtonId(itemId)}`).click();

        // there is no shortlinks for the moment
        expectNumberOfShortLinks(0);

        // but because the shortlinks "replace" the link,
        // there is one link per platform
        cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);
        cy.get(
          `#${buildShortLinkShortenBtnId(itemId, Context.Library)}`,
        ).click();

        cy.wait('@checkShortLink').then(
          ({
            response: { statusCode: checkStatusCode, body: availableBody },
          }) => {
            expect(checkStatusCode).equals(StatusCodes.OK);
            expect(availableBody.available).equals(true);
          },
        );
        cy.get(`#${SHORT_LINK_SAVE_BUTTON_ID}`).click();

        cy.wait('@postShortLink').then(
          ({ response: { statusCode: postCode, body: postBody } }) => {
            expect(postCode).equals(StatusCodes.OK);
            expect(postBody.platform).equals(Context.Library);
          },
        );

        expectNumberOfShortLinks(1);
      });
    });
  });

  describe('Read permission', () => {
    let itemId: string;
    let shortLinks: ShortLink[];

    const READ_ITEMS = [
      PackedFolderItemFactory({}, { permission: PermissionLevel.Read }),
      PackedFolderItemFactory({}, { permission: PermissionLevel.Read }),
    ];

    beforeEach(() => {
      itemId = READ_ITEMS[0].id;

      shortLinks = [
        {
          alias: 'test-1',
          platform: Context.Player,
          itemId,
        },
      ];

      cy.setUpApi({
        items: READ_ITEMS,
        getShortLinkAvailable: true, // indicates that the short link is available
        shortLinks,
        itemId,
      });
    });

    it('Short links are read only', () => {
      cy.visit(buildItemPath(itemId));
      cy.get(`#${buildShareButtonId(itemId)}`).click();
      expectNumberOfShortLinks(1);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 2);
      // This wait is necessary to be sure that the UI render the short links with add and/or menu buttons
      cy.wait(1000);
      // It shouldn't have a shortLink menu button allowing user to edit it
      cy.get(`[id^=${SHORT_LINK_MENU_START_ID}]`).should('have.length', 0);
      // It shouldn't have a shortenize button allowing user to create a shortlink
      cy.get(`[id^=${SHORT_LINK_SHORTEN_START_ID}]`).should('have.length', 0);
    });
  });
});
