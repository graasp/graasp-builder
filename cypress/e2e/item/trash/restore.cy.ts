import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  RECYCLE_BIN_RESTORE_MANY_ITEMS_BUTTON_ID,
  RESTORE_ITEMS_BUTTON_CLASS,
  buildItemCard,
} from '../../../../src/config/selectors';

const restoreItem = (id: string) => {
  cy.get(`#${buildItemCard(id)} .${RESTORE_ITEMS_BUTTON_CLASS}`).click();
};
const restoreItems = () => {
  cy.get(`#${RECYCLE_BIN_RESTORE_MANY_ITEMS_BUTTON_ID}`).click();
};

const recycledItemData = [
  PackedRecycledItemDataFactory(),
  PackedRecycledItemDataFactory(),
];

describe('Restore Items', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: recycledItemData.map(({ item }) => item),
      recycledItemData,
    });
    cy.visit(RECYCLE_BIN_PATH);
  });

  it('restore one item', () => {
    const { id } = recycledItemData[0].item;

    // restore
    restoreItem(id);
    cy.wait('@restoreItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });

  it('restore many items', () => {
    recycledItemData.forEach(({ item }) => {
      cy.selectItem(item.id);
    });

    restoreItems();

    cy.wait('@restoreItems').then(({ request: { url } }) => {
      recycledItemData.forEach(({ item }) => {
        expect(url).to.contain(item.id);
      });
    });
  });
});
