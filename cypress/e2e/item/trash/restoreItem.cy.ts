import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  RESTORE_ITEMS_BUTTON_CLASS,
  buildItemCard,
} from '../../../../src/config/selectors';

const restoreItem = (id: string) => {
  cy.get(`#${buildItemCard(id)} .${RESTORE_ITEMS_BUTTON_CLASS}`).click();
};

describe('Restore Items', () => {
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

    const { id } = recycledItemData[0].item;

    // restore
    restoreItem(id);
    cy.wait('@restoreItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });
});
