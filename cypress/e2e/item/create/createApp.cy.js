import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { GRAASP_APP_ITEM } from '../../../fixtures/apps';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from './utils';

describe('Create App', () => {
  describe('create app on Home', () => {
    it('Create app on Home with dropdown', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(GRAASP_APP_ITEM, ITEM_LAYOUT_MODES.LIST);

      cy.wait('@postItem').then(() => {
        // check item is created and displayed
        cy.wait(CREATE_ITEM_PAUSE);
        // should update view
        cy.wait('@getOwnItems');
      });
    });

    it('Create app on Home by typing', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(GRAASP_APP_ITEM, { type: true });

      cy.wait('@postItem').then(() => {
        // check item is created and displayed
        cy.wait(CREATE_ITEM_PAUSE);
        // should update view
        cy.wait('@getOwnItems');
      });
    });
  });

  describe('create app in item', () => {
    it('Create app with dropdown', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(GRAASP_APP_ITEM, ITEM_LAYOUT_MODES.LIST);

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });

    it('Create app by typing', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(GRAASP_APP_ITEM, { type: true });

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });
  });
});
