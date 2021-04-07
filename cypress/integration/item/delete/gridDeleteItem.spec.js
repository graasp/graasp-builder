import { ITEM_LAYOUT_MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  ITEM_DELETE_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const deleteItem = (id) => {
  cy.get(`#${buildItemCard(id)} .${ITEM_DELETE_BUTTON_CLASS}`).click();
};

describe('Delete Item in Grid', () => {
  it('delete item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    const { id } = SAMPLE_ITEMS.items[0];

    // delete
    deleteItem(id);
    cy.wait(['@deleteItem', '@getOwnItems']);
  });

  it('delete item inside parent', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    const { id: idToDelete } = SAMPLE_ITEMS.items[2];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // delete
    deleteItem(idToDelete);
    cy.wait('@deleteItem').then(() => {
      // check update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  describe('Error handling', () => {
    it('error while deleting item does not delete in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, deleteItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];
      const { id: idToDelete } = SAMPLE_ITEMS.items[2];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // delete
      deleteItem(idToDelete);

      cy.wait('@deleteItem').then(() => {
        // check item is still displayed
        cy.get(`#${buildItemCard(idToDelete)}`).should('exist');
      });
    });
  });
});
