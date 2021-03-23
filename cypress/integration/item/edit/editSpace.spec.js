import { DEFAULT_MODE, MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  buildItemsTableRowId,
} from '../../../../src/config/selectors';
import { EDITED_FIELDS, SAMPLE_ITEMS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from './utils';

describe('Edit Space', () => {
  describe('List', () => {
    it('edit space on Home', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      cy.visit(HOME_PATH);

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      const itemToEdit = SAMPLE_ITEMS[0];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
          cy.get(`#${buildItemsTableRowId(id)}`).contains(name);
        },
      );
    });

    it('edit space in item', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      // go to children item
      cy.visit(buildItemPath(SAMPLE_ITEMS[0].id));

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      const itemToEdit = SAMPLE_ITEMS[2];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
          cy.get(`#${buildItemsTableRowId(id)}`).contains(name);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit space on Home', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      cy.visit(HOME_PATH);
      cy.switchMode(MODES.GRID);

      const itemToEdit = SAMPLE_ITEMS[0];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get(`#${buildItemCard(id)}`).should('exist');
          cy.get(`#${buildItemLink(id)}`).contains(name);
        },
      );
    });

    it('edit space in item', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      // go to children item
      cy.visit(buildItemPath(SAMPLE_ITEMS[0].id));
      cy.switchMode(MODES.GRID);

      const itemToEdit = SAMPLE_ITEMS[2];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get(`#${buildItemCard(id)}`).should('exist');
          cy.get(`#${buildItemLink(id)}`).contains(name);
        },
      );
    });
  });
});
