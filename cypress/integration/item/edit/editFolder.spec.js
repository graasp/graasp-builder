import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { EDITED_FIELDS, SAMPLE_ITEMS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from './utils';

describe('Edit Folder', () => {
  describe('List', () => {
    it('edit folder on Home', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      const itemToEdit = SAMPLE_ITEMS.items[0];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.LIST,
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
          expect(description).to.equal(EDITED_FIELDS.description);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });

    it('edit folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      // go to children item
      cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      const itemToEdit = SAMPLE_ITEMS.items[2];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          expect(description).to.equal(EDITED_FIELDS.description);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', SAMPLE_ITEMS.items[0].id);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit folder on Home', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = SAMPLE_ITEMS.items[0];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          expect(description).to.equal(EDITED_FIELDS.description);
        },
      );
    });

    it('edit folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      // go to children item
      cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = SAMPLE_ITEMS.items[2];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          expect(description).to.equal(EDITED_FIELDS.description);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', SAMPLE_ITEMS.items[0].id);
        },
      );
    });
  });
});
