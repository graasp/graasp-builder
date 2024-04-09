import { PackedShortcutItemFactory } from '@graasp/sdk';

import { HOME_PATH } from '../../../../src/config/paths';
import { ItemLayoutMode } from '../../../../src/enums';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

const EDITED_FIELDS = {
  name: 'new name',
};

const SHORTCUT = PackedShortcutItemFactory();

describe('Edit Shortcut', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [SHORTCUT] });
  });

  describe('List', () => {
    it('edit shortcut on Home', () => {
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      const itemToEdit = SHORTCUT;

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
          cy.get('@getAccessibleItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit shortcut on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      const itemToEdit = SHORTCUT;

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
  });
});
