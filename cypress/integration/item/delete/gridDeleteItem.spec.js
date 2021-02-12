import { MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  ITEM_DELETE_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

const deleteItem = (id) => {
  cy.get(`#${buildItemCard(id)} .${ITEM_DELETE_BUTTON_CLASS}`).click();
};

describe('Delete Item in Grid', () => {
  it('delete item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.GRID);

    const { id } = SIMPLE_ITEMS[0];

    // delete
    deleteItem(id);
    cy.wait('@deleteItem').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemCard(id)}`).should('not.exist');
      cy.get(`#${buildItemCard(SIMPLE_ITEMS[1].id)}`).should('exist');
    });
  });

  it('delete item inside parent', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];
    const { id: idToDelete } = SIMPLE_ITEMS[2];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.GRID);

    // delete
    deleteItem(idToDelete);
    cy.wait('@deleteItem').then(() => {
      // check item is deleted, others are still displayed
      cy.get(`#${buildItemCard(idToDelete)}`).should('not.exist');
      cy.get(`#${buildItemCard(SIMPLE_ITEMS[3].id)}`).should('exist');
    });
  });

  describe('Errors handling', () => {
    it('error while deleting item does not delete in interface', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, deleteItemError: true });
      const { id } = SIMPLE_ITEMS[0];
      const { id: idToDelete } = SIMPLE_ITEMS[2];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(MODES.GRID);

      // delete
      deleteItem(idToDelete);

      cy.wait('@deleteItem').then(() => {
        // check item is still displayed
        cy.get(`#${buildItemCard(idToDelete)}`).should('exist');
      });
    });
  });
});
