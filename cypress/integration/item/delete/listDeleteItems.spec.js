import { MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_ROW_CHECKBOX_CLASS,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

const deleteItems = (itemIds) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(
      `#${buildItemsTableRowId(id)} .${ITEMS_TABLE_ROW_CHECKBOX_CLASS}`,
    ).click();
  });

  cy.get(`#${ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}`).click();
};

describe('Delete Items in List', () => {
  it('delete 2 items in Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.LIST);

    // delete
    deleteItems([SIMPLE_ITEMS[0].id, SIMPLE_ITEMS[1].id]);
    cy.wait('@deleteItems').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[1].id)}`).should(
        'not.exist',
      );
      cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[1].id)}`).should(
        'not.exist',
      );
    });
  });

  it('delete 2 items in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(buildItemPath(SIMPLE_ITEMS[0].id));
    cy.switchMode(MODES.LIST);

    // delete
    deleteItems([SIMPLE_ITEMS[2].id, SIMPLE_ITEMS[3].id]);
    cy.wait('@deleteItems').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[2].id)}`).should(
        'not.exist',
      );
      cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[3].id)}`).should(
        'not.exist',
      );
    });
  });

  describe('Errors handling', () => {
    it('does not delete items on error', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, deleteItemsError: true });
      cy.visit(HOME_PATH);
      cy.switchMode(MODES.LIST);

      // delete
      deleteItems([SIMPLE_ITEMS[0].id, SIMPLE_ITEMS[1].id]);
      cy.wait('@deleteItems').then(() => {
        // check item is deleted, others are still displayed
        cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[0].id)}`).should('exist');
        cy.get(`#${buildItemsTableRowId(SIMPLE_ITEMS[1].id)}`).should('exist');
      });
    });
  });
});
