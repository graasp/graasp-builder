import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID,
  RESTORE_ITEMS_BUTTON_CLASS,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { RECYCLED_ITEM_DATA, SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const restoreItem = (id) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(
    `${buildItemsTableRowIdAttribute(id)} .${RESTORE_ITEMS_BUTTON_CLASS}`,
  ).click();
};

const restoreItems = (itemIds) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.wait(TABLE_ITEM_RENDER_TIME);
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID}`).click();
};

describe('Restore Items in List', () => {
  it('restore one item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, recycledItemData: RECYCLED_ITEM_DATA });
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    const { id } = RECYCLED_ITEM_DATA[0].item;

    // restore
    restoreItem(id);
    cy.wait('@restoreItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });

  it('restore multiple items', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, recycledItemData: RECYCLED_ITEM_DATA });
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // restore
    const itemIds = RECYCLED_ITEM_DATA.map(({ item }) => item.id);
    restoreItems(itemIds);
    cy.wait('@restoreItems').then(({ request: { url } }) => {
      for (const id of itemIds) {
        expect(url).to.contain(id);
      }
    });
    cy.wait('@getRecycledItems');
  });

  describe('Error handling', () => {
    it('error while restoring item does not delete in interface', () => {
      cy.setUpApi({
        ...SAMPLE_ITEMS,
        recycledItemData: RECYCLED_ITEM_DATA,
        restoretItemsError: true,
      });
      const { id } = RECYCLED_ITEM_DATA[0].item;

      // go to children item
      cy.visit(RECYCLE_BIN_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // restore
      restoreItem(id);

      cy.wait('@restoreItems').then(() => {
        // check item is still displayed
        cy.get(buildItemsTableRowIdAttribute(id)).should('exist');
      });
    });
  });
});
