import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  ITEM_DELETE_BUTTON_CLASS,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const deleteItem = (id: string) => {
  cy.get(
    `${buildItemsTableRowIdAttribute(id)} .${ITEM_DELETE_BUTTON_CLASS}`,
  ).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Item in List', () => {
  it('delete item', () => {
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

    // delete
    deleteItem(id);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });
});
