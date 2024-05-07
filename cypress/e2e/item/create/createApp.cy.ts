import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import {
  GRAASP_APP_ITEM,
  GRAASP_CUSTOM_APP_ITEM,
} from '../../../fixtures/apps';
import { APPS_LIST } from '../../../fixtures/apps/apps';
import { createApp } from '../../../support/createUtils';

const FOLDER = PackedFolderItemFactory();

describe('Create App', () => {
  describe('create app on Home', () => {
    it('Create app on Home with dropdown', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      // create
      createApp(GRAASP_APP_ITEM, { id: APPS_LIST[0].id });

      cy.wait('@postItem').then(() => {
        // should update view
        cy.wait('@getAccessibleItems');
      });
    });

    it('Create app on Home by typing', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      // create
      createApp(GRAASP_APP_ITEM, { custom: true });

      cy.wait('@postItem').then(() => {
        // should update view
        cy.wait('@getAccessibleItems');
      });
    });
  });

  describe('create app in item', () => {
    it('Create app with dropdown', () => {
      cy.setUpApi({ items: [FOLDER] });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ItemLayoutMode.List);

      // create
      createApp(GRAASP_APP_ITEM, { id: APPS_LIST[0].id });

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });

    it('Create a custom app', () => {
      cy.setUpApi({ items: [FOLDER] });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ItemLayoutMode.List);

      // create
      createApp(GRAASP_CUSTOM_APP_ITEM, { custom: true });

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });
  });
});
