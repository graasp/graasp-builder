import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import {
  GRAASP_APP_ITEM,
  GRAASP_CUSTOM_APP_ITEM,
} from '../../../fixtures/apps';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { createApp } from '../../../support/createUtils';

describe('Create App', () => {
  describe('create app on Home', () => {
    it('Create app on Home with dropdown', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createApp(GRAASP_APP_ITEM);

      cy.wait('@postItem').then(() => {
        // should update view
        cy.wait('@getOwnItems');
      });
    });

    it('Create app on Home by typing', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createApp(GRAASP_APP_ITEM);

      cy.wait('@postItem').then(() => {
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

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createApp(GRAASP_APP_ITEM);

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });

    it('Create a custom app', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createApp(GRAASP_CUSTOM_APP_ITEM, { custom: true });

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });
  });
});
