import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  SETTINGS_CHATBOX_TOGGLE,
  SETTINGS_PINNED_TOGGLE,
} from '../../../../src/config/selectors';
import { ITEMS_SETTINGS } from '../../../fixtures/items';

describe('Item Settings', () => {
  beforeEach(() => {
    cy.setUpApi(ITEMS_SETTINGS);
  });

  describe('Chatbox Settings', () => {
    it('Disabling Chatbox', () => {
      cy.visit(buildItemPath(ITEMS_SETTINGS.items[0].id));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE}`).should('be.checked');

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE}`).should('not.be.checked');
    });

    it('Enabling Chatbox', () => {
      cy.visit(buildItemPath(ITEMS_SETTINGS.items[1].id));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE}`).should('not.be.checked');

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE}`).should('be.checked');
    });
  });

  describe('Pinned Settings', () => {
    it('Unpin Items', () => {
      cy.visit(buildItemPath(ITEMS_SETTINGS.items[0].id));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE}`).should('be.checked');

      cy.get(`#${SETTINGS_PINNED_TOGGLE}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE}`).should('not.be.checked');
    });

    it('Pin Item', () => {
      cy.visit(buildItemPath(ITEMS_SETTINGS.items[1].id));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE}`).should('not.be.checked');

      cy.get(`#${SETTINGS_PINNED_TOGGLE}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE}`).should('be.checked');
    });
  });
});
