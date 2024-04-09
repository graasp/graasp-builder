import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID,
  RESTORE_ITEMS_BUTTON_CLASS,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const restoreItem = (id: string) => {
  cy.get(
    `${buildItemsTableRowIdAttribute(id)} .${RESTORE_ITEMS_BUTTON_CLASS}`,
  ).click();
};

const restoreItems = (itemIds: string[]) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID}`).click();
};

describe('Restore Items in List', () => {
  it('restore one item', () => {
    const recycledItemData = [
      PackedRecycledItemDataFactory(),
      PackedRecycledItemDataFactory(),
    ];
    cy.setUpApi({
      items: recycledItemData.map(({ item }) => item),
      recycledItemData,
    });
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ItemLayoutMode.List);
    const { id } = recycledItemData[0].item;

    // restore
    restoreItem(id);
    cy.wait('@restoreItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });

  it('restore multiple items', () => {
    const recycledItemData = [
      PackedRecycledItemDataFactory(),
      PackedRecycledItemDataFactory(),
    ];
    const items = recycledItemData.map(({ item }) => item);
    cy.setUpApi({
      items,
      recycledItemData,
    });
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // restore
    const itemIds = items.map(({ id }) => id);
    restoreItems(itemIds);
    cy.wait('@restoreItems').then(({ request: { url } }) => {
      for (const id of itemIds) {
        expect(url).to.contain(id);
      }
    });
    cy.wait('@getRecycledItems');
  });
});
