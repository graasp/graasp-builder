import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const deleteItems = (itemIds: string[]) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}`).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Items in List', () => {
  const recycledItemData = [
    PackedRecycledItemDataFactory(),
    PackedRecycledItemDataFactory(),
  ];
  const items = recycledItemData.map(({ item }) => item);
  const itemIds = items.map(({ id }) => id);
  it('delete items', () => {
    cy.setUpApi({ items, recycledItemData });
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
