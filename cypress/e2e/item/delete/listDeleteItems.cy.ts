import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { RECYCLED_ITEM_DATA, SAMPLE_ITEMS } from '../../../fixtures/items';

const deleteItems = (itemIds: string[]) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}`).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Items in List', () => {
  const itemIds = [
    RECYCLED_ITEM_DATA[0].item.id,
    RECYCLED_ITEM_DATA[1].item.id,
  ];
  it('delete items', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, recycledItemData: RECYCLED_ITEM_DATA });
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // delete
    deleteItems(itemIds);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      for (const id of itemIds) {
        expect(url).to.contain(id);
      }
    });
    cy.wait('@getRecycledItems');
  });
});
