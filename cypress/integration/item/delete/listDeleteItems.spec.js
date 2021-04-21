import {
  ITEM_LAYOUT_MODES,
  DEFAULT_ITEM_LAYOUT_MODE,
} from '../../../../src/config/constants';
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

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // delete
    deleteItems([SAMPLE_ITEMS[0].id, SAMPLE_ITEMS[1].id]);
    cy.wait(['@deleteItems', '@getOwnItems']);
  });

  it('delete 2 items in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // delete
    deleteItems([SAMPLE_ITEMS[2].id, SAMPLE_ITEMS[3].id]);
    cy.wait('@deleteItems').then(() => {
      // check item is deleted, others are still displayed
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  describe('Errors handling', () => {
    it('does not delete items on error', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS, deleteItemsError: true });
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
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
