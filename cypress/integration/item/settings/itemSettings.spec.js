import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_LINK_SHOW_BUTTON_ID,
  SETTINGS_LINK_SHOW_IFRAME_ID,
  SETTINGS_PINNED_TOGGLE_ID,
} from '../../../../src/config/selectors';
import { ITEMS_SETTINGS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';

describe('Item Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      ...ITEMS_SETTINGS,
      items: [...ITEMS_SETTINGS.items, GRAASP_LINK_ITEM],
    });
  });

  describe('Chatbox Settings', () => {
    it('Disabling Chatbox', () => {
      const itemId = ITEMS_SETTINGS.items[1].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).should('be.checked');

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.showChatbox).equals(false);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Enabling Chatbox', () => {
      const itemId = ITEMS_SETTINGS.items[2].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).should('not.be.checked');

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.showChatbox).equals(true);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });
  });

  describe('Pinned Settings', () => {
    it('Unpin Items', () => {
      const itemId = ITEMS_SETTINGS.items[1].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).should('be.checked');

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).equals(false);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Pin Item', () => {
      const itemId = ITEMS_SETTINGS.items[2].id;
      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).should('not.be.checked');

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).equals(true);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });
  });

  describe('Link Settings', () => {
    it('Does not show link settings for folder item', () => {
      const itemId = ITEMS_SETTINGS.items[0].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).should('not.exist');
      cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).should('not.exist');
    });

    it.only('Toggle Iframe', () => {
      const itemId = GRAASP_LINK_ITEM.id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).should('be.checked');

      cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.showLinkIframe).equals(false);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Toggle Button', () => {
      const itemId = GRAASP_LINK_ITEM.id;
      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).should('not.be.checked');

      cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.showLinkButton).equals(true);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });
  });
});
