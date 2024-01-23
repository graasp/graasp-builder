import { Context, ShortLink, appendPathToUrl } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';
import { ShortLinkPlatform } from '@/utils/shortLink';

import {
  SHARE_ITEM_QR_BTN_ID,
  SHARE_ITEM_QR_DIALOG_ID,
  SHORT_LINK_COMPONENT,
  buildShareButtonId,
  buildShortLinkPlatformTextId,
  buildShortLinkUrlTextId,
} from '../../../../src/config/selectors';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import {
  GRAASP_REDIRECTION_HOST,
  buildGraaspBuilderView,
  buildGraaspLibraryLink,
  buildGraaspPlayerView,
} from '../../../support/paths';

export const checkContainPlatformText = (platform: ShortLinkPlatform): void => {
  cy.get(`#${buildShortLinkPlatformTextId(platform)}`).should(
    'contain',
    platform,
  );
};

export const checkContainUrlText = (
  platform: ShortLinkPlatform,
  itemId: string,
): void => {
  let expectedUrl;

  // The client host manager can't be used here because
  // cypress run this before the main.tsx, where the manager is init.
  switch (platform) {
    case 'builder':
      expectedUrl = buildGraaspBuilderView(itemId);
      break;
    case 'player':
      expectedUrl = buildGraaspPlayerView(itemId);
      break;
    case 'library':
      expectedUrl = buildGraaspLibraryLink(itemId);
      break;
    default:
      throw new Error(`The given platform ${platform} is unknown.`);
  }

  cy.get(`#${buildShortLinkUrlTextId(platform)}`).should(
    'contain',
    expectedUrl,
  );
};

const checkContainShortLinkText = (
  platform: ShortLinkPlatform,
  alias: string,
) => {
  const expectedUrl = appendPathToUrl({
    baseURL: GRAASP_REDIRECTION_HOST,
    pathname: alias,
  }).toString();

  cy.get(`#${buildShortLinkUrlTextId(platform)}`).should(
    'contain',
    expectedUrl,
  );
};

describe('Share Item Link', () => {
  describe('Without short links', () => {
    const item = PUBLISHED_ITEM;

    beforeEach(() => {
      cy.setUpApi({ items: [PUBLISHED_ITEM] });
    });

    it('Builder link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Builder;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });

    it('Player link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Player;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });

    it('Library link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Library;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });

    it('Share Item with QR Code', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      cy.get(`#${SHARE_ITEM_QR_BTN_ID}`).click();
      cy.get(`#${SHARE_ITEM_QR_DIALOG_ID}`).should('exist');
    });
  });

  describe('With short links', () => {
    const item = PUBLISHED_ITEM;

    const shortLinks: ShortLink[] = [
      {
        alias: 'test-1',
        platform: Context.Builder,
        item: { id: item.id },
        createdAt: new Date().toISOString(),
      },
      {
        alias: 'test-2',
        platform: Context.Player,
        item: { id: item.id },
        createdAt: new Date().toISOString(),
      },
      {
        alias: 'test-3',
        platform: Context.Library,
        item: { id: item.id },
        createdAt: new Date().toISOString(),
      },
    ];

    beforeEach(() => {
      cy.setUpApi({ items: [PUBLISHED_ITEM], shortLinks, itemId: item.id });
    });

    it('Builder link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.wait('@getShortLinksItem').its('response.body.length').should('eq', 3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Builder;
      checkContainPlatformText(context);
      checkContainShortLinkText(context, shortLinks[0].alias);
    });

    it('Player link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.wait('@getShortLinksItem').its('response.body.length').should('eq', 3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Player;
      checkContainPlatformText(context);
      checkContainShortLinkText(context, shortLinks[1].alias);
    });

    it('Library link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.wait('@getShortLinksItem').its('response.body.length').should('eq', 3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Library;
      checkContainPlatformText(context);
      checkContainShortLinkText(context, shortLinks[2].alias);
    });

    it('Share Item with QR Code', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.wait('@getShortLinksItem').its('response.body.length').should('eq', 3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      cy.get(`#${SHARE_ITEM_QR_BTN_ID}`).click();
      cy.get(`#${SHARE_ITEM_QR_DIALOG_ID}`).should('exist');
    });
  });
});
