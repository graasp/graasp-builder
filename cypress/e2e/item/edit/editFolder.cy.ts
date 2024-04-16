import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  buildEditButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

const EDITED_FIELDS = {
  name: 'new name',
};

describe('Edit Folder', () => {
  describe('List', () => {
    it.only('confirm with empty name', () => {
      const item = PackedFolderItemFactory();
      cy.setUpApi({ items: [item] });
      cy.visit(HOME_PATH);

      // click edit button
      const itemId = item.id;
      // todo: remove once the table is refactored
      cy.wait(500);
      cy.get(`#${buildEditButtonId(itemId)}`).click();

      cy.fillFolderModal(
        {
          // put an empty name for the folder
          name: '',
        },
        { confirm: false },
      );

      // check that the button can not be clicked
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should('be.disabled');
    });

    it('edit folder on Home', () => {
      const item = PackedFolderItemFactory();
      cy.setUpApi({ items: [item] });
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      const itemToEdit = item;
      const newDescription = 'new description';
      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
          description: newDescription,
        },
        ItemLayoutMode.List,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          expect(description).to.contain(newDescription);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getAccessibleItems');
        },
      );
    });

    it('edit folder in item', () => {
      const parentItem = PackedFolderItemFactory();
      const itemToEdit = PackedFolderItemFactory({ parentItem });
      cy.setUpApi({ items: [parentItem, itemToEdit] });
      // go to children item
      cy.visit(buildItemPath(itemToEdit.id));

      cy.switchMode(ItemLayoutMode.List);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ItemLayoutMode.List,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', itemToEdit.id);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit folder on Home', () => {
      const itemToEdit = PackedFolderItemFactory();
      cy.setUpApi({ items: [itemToEdit] });
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ItemLayoutMode.Grid,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getAccessibleItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });

    it('edit folder in item', () => {
      const parentItem = PackedFolderItemFactory();
      const itemToEdit = PackedFolderItemFactory({ parentItem });
      cy.setUpApi({ items: [parentItem, itemToEdit] });
      // go to children item
      cy.visit(buildItemPath(itemToEdit.id));
      cy.switchMode(ItemLayoutMode.Grid);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ItemLayoutMode.Grid,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', itemToEdit.id);
        },
      );
    });
  });
});
