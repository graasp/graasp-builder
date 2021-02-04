import { MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  ITEM_DELETE_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

const deleteItem = (id) => {
  cy.get(`#${buildItemsTableRowId(id)} .${ITEM_DELETE_BUTTON_CLASS}`).click();
};

describe('Delete Item in List', () => {
  it('delete item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.LIST);

    const { id } = SIMPLE_ITEMS[0];

    // delete
    deleteItem(id);
    cy.wait('@deleteItem').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemsTableRowId(id)}`).should('not.exist');
      cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[1].id)}`).should('exist');
    });
  });

  it('delete item inside parent', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];
    const { id: idToDelete } = SIMPLE_ITEMS[2];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.LIST);

    // delete
    deleteItem(idToDelete);
    cy.wait('@deleteItem').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemsTableRowId(idToDelete)}`).should('not.exist');
      cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[3].id)}`).should('exist');
    });
  });

  describe('Errors handling', () => {
    it('error while deleting item does not delete in interface', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, deleteItemError: true });
      const { id } = SIMPLE_ITEMS[0];
      const { id: idToDelete } = SIMPLE_ITEMS[2];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(MODES.LIST);

      // delete
      deleteItem(idToDelete);

      cy.wait('@deleteItem').then(() => {
        // check item is still displayed
        cy.get(`#${buildItemsTableRowId(idToDelete)}`).should('exist');
      });
    });
  });
});
