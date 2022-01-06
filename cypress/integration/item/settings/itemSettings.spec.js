import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
} from '../../../../src/config/selectors';
import { ITEMS_SETTINGS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';

describe('Item Settings', () => {
  beforeEach(() => {
    cy.setUpApi({ ...ITEMS_SETTINGS });
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
});
