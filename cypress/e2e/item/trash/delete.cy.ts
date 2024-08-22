import { PackedRecycledItemDataFactory } from '@graasp/sdk';

import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  DELETE_SINGLE_ITEM_BUTTON_SELECTOR,
  RECYCLE_BIN_DELETE_MANY_ITEMS_BUTTON_ID,
  buildItemCard,
} from '../../../../src/config/selectors';

const deleteItem = (id: string) => {
  cy.get(`#${buildItemCard(id)} ${DELETE_SINGLE_ITEM_BUTTON_SELECTOR}`).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

const deleteItems = () => {
  cy.get(`#${RECYCLE_BIN_DELETE_MANY_ITEMS_BUTTON_ID}`).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

const recycledItemData = [
  PackedRecycledItemDataFactory(),
  PackedRecycledItemDataFactory(),
];

describe('Delete Items', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: recycledItemData.map(({ item }) => item),
      recycledItemData,
    });
    cy.visit(RECYCLE_BIN_PATH);
  });

  it('delete item', () => {
    const { id } = recycledItemData[0].item;

    // delete
    deleteItem(id);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });

  it('delete many items', () => {
    recycledItemData.forEach(({ item }) => {
      cy.selectItem(item.id);
    });

    deleteItems();

    cy.wait('@deleteItems').then(({ request: { url } }) => {
      recycledItemData.forEach(({ item }) => {
        expect(url).to.contain(item.id);
      });
    });
  });
});
