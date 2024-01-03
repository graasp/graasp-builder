import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  ITEM_DELETE_BUTTON_CLASS,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { RECYCLED_ITEM_DATA, SAMPLE_ITEMS } from '../../../fixtures/items';

const deleteItem = (id: string) => {
  cy.get(
    `${buildItemsTableRowIdAttribute(id)} .${ITEM_DELETE_BUTTON_CLASS}`,
  ).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Item in List', () => {
  it('delete item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, recycledItemData: RECYCLED_ITEM_DATA });
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    const { id } = RECYCLED_ITEM_DATA[0].item;

    // delete
    deleteItem(id);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });
});
