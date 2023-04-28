import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  ITEM_DELETE_BUTTON_CLASS,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const deleteItem = (id) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(
    `${buildItemsTableRowIdAttribute(id)} .${ITEM_DELETE_BUTTON_CLASS}`,
  ).click();
  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

describe('Delete Item in List', () => {
  it('delete item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(RECYCLE_BIN_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    const { id } = SAMPLE_ITEMS.items[0];

    // delete
    deleteItem(id);
    cy.wait('@deleteItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });

  describe('Error handling', () => {
    it('error while deleting item does not delete in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, deleteItemsError: true });
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(RECYCLE_BIN_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // delete
      deleteItem(id);

      cy.wait('@deleteItems').then(() => {
        // check item is still displayed
        cy.get(buildItemsTableRowIdAttribute(id)).should('exist');
      });
    });
  });
});
