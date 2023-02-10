import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CONFIRM_DELETE_BUTTON_ID,
  ITEM_DELETE_BUTTON_CLASS,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../fixtures/enums';
import { DATABASE_WITH_RECYCLE_BIN } from '../../../fixtures/recycleBin';
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
    cy.setUpApi(DATABASE_WITH_RECYCLE_BIN);
    cy.visit(RECYCLE_BIN_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    const { id } = DATABASE_WITH_RECYCLE_BIN.recycledItems[0];

    // delete
    deleteItem(id);
    cy.wait('@deleteItem').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getRecycledItems');
  });

  describe('Error handling', () => {
    it('error while deleting item does not delete in interface', () => {
      cy.setUpApi({ ...DATABASE_WITH_RECYCLE_BIN, deleteItemError: true });
      const { id } = DATABASE_WITH_RECYCLE_BIN.recycledItems[0];

      // go to children item
      cy.visit(RECYCLE_BIN_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // delete
      deleteItem(id);

      cy.wait('@deleteItem').then(() => {
        // check item is still displayed
        cy.get(buildItemsTableRowIdAttribute(id)).should('exist');
      });
    });
  });
});
