import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  buildItemCard,
} from '../../../../src/config/selectors';

const deleteItem = (id: string) => {
  cy.get(`#${buildItemCard(id)} [data-testid="DeleteIcon"]`).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Item', () => {
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

    const { id } = recycledItemData[0].item;

    // delete
    deleteItem(id);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });
});
