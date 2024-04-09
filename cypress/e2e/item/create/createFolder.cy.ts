import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import { createFolder } from '../../../support/createUtils';

describe('Create Folder', () => {
  describe('List', () => {
    it('create folder on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      // create
      createFolder({ name: 'created item' });

      cy.wait(['@postItem', '@getAccessibleItems']);
    });

    it('create folder in item', () => {
      const FOLDER = PackedFolderItemFactory();
      cy.setUpApi({ items: [FOLDER] });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ItemLayoutMode.List);

      // create
      createFolder({ name: 'created item' });
    });

    it('cannot create folder with blank name in item', () => {
      // create
      cy.setUpApi();
      cy.visit(HOME_PATH);
      createFolder({ name: ' ' }, { confirm: false });

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });

    it('description placement should not exist for folder', () => {
      // create
      cy.setUpApi();
      cy.visit(HOME_PATH);
      createFolder({ name: ' ' }, { confirm: false });

      cy.get(`#${ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID}`).should(
        'not.exist',
      );
    });
  });

  describe('Grid', () => {
    it('create folder on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      // create
      createFolder({ name: 'created item' });

      cy.wait('@postItem');
      // small necessary pause required in order for the form to be able to reset
      cy.wait(300);
      // form is cleared
      cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click({ force: true });
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).should('have.value', '');
    });

    it('create folder in item', () => {
      const FOLDER = PackedFolderItemFactory();
      cy.setUpApi({ items: [FOLDER] });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.Grid);

      // create
      createFolder({ name: 'created item' });

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });
  });

  describe('Error handling', () => {
    it('error while creating folder does not create in interface', () => {
      const FOLDER = PackedFolderItemFactory();
      cy.setUpApi({ items: [FOLDER], postItemError: true });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ItemLayoutMode.List);

      // create
      createFolder({ name: 'created item' });

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(buildItemsTableRowIdAttribute(body.id)).should('not.exist');
      });
    });
  });
});
