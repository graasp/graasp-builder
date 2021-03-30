import { MODES, DEFAULT_MODE } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_ROW_CHECKBOX_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

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
    cy.setUpApi({ items: SAMPLE_ITEMS });
    cy.visit(HOME_PATH);

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // delete
    deleteItems([SAMPLE_ITEMS[0].id, SAMPLE_ITEMS[1].id]);
    cy.wait('@deleteItems').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS[1].id)}`).should(
        'not.exist',
      );
      cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS[1].id)}`).should(
        'not.exist',
      );
    });
  });

  it('delete 2 items in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    cy.visit(buildItemPath(SAMPLE_ITEMS[0].id));

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // delete
    deleteItems([SAMPLE_ITEMS[2].id, SAMPLE_ITEMS[3].id]);
    cy.wait('@deleteItems').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS[2].id)}`).should(
        'not.exist',
      );
      cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS[3].id)}`).should(
        'not.exist',
      );
    });
  });

  describe('Errors handling', () => {
    it('does not delete items on error', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS, deleteItemsError: true });
      cy.visit(HOME_PATH);

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      // delete
      deleteItems([SAMPLE_ITEMS[0].id, SAMPLE_ITEMS[1].id]);
      cy.wait('@deleteItems').then(() => {
        // check item is deleted, others are still displayed
        cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS[0].id)}`).should('exist');
        cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS[1].id)}`).should('exist');
      });
    });
  });
});
