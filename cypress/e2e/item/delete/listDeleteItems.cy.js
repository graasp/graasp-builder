import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowIdAttribute,
  CONFIRM_DELETE_BUTTON_ID,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
} from '../../../../src/config/selectors';
import { DATABASE_WITH_RECYCLE_BIN } from '../../../fixtures/recycleBin';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const deleteItems = (itemIds) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.wait(TABLE_ITEM_RENDER_TIME);
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}`).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Items in List', () => {
  const itemIds = [
    DATABASE_WITH_RECYCLE_BIN.recycledItems[0].id,
    DATABASE_WITH_RECYCLE_BIN.recycledItems[1].id,
  ];
  it('delete items', () => {
    cy.setUpApi(DATABASE_WITH_RECYCLE_BIN);
    cy.visit(RECYCLE_BIN_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // delete
    deleteItems(itemIds);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      for (const id of itemIds) {
        expect(url).to.contain(id);
      }
    });
    cy.wait('@getRecycledItems');
  });

  describe('Error handling', () => {
    it('error while deleting items does not delete in interface', () => {
      cy.setUpApi({ ...DATABASE_WITH_RECYCLE_BIN, deleteItemError: true });

      // go to children item
      cy.visit(RECYCLE_BIN_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // delete
      deleteItems(itemIds);

      cy.wait('@deleteItems').then(() => {
        // check items are still displayed
        for (const id of itemIds) {
          cy.get(buildItemsTableRowIdAttribute(id)).should('exist');
        }
      });
    });
  });
});
