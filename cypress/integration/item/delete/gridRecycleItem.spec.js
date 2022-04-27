import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  buildItemMenuButtonId,
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const recycleItem = (id) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

describe('Recycle Item in Grid', () => {
  it('recycle item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    const { id } = SAMPLE_ITEMS.items[0];

    // recycle
    recycleItem(id);
    cy.wait(['@recycleItems', '@getOwnItems']);
  });

  it('recycle item inside parent', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    const { id: idToDelete } = SAMPLE_ITEMS.items[2];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // recycle
    recycleItem(idToDelete);
    cy.wait('@recycleItems').then(() => {
      // check update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  describe('Error handling', () => {
    it('error while deleting item does not recycle in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, recycleItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];
      const { id: idToDelete } = SAMPLE_ITEMS.items[2];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // recycle
      recycleItem(idToDelete);

      cy.wait('@recycleItems').then(() => {
        // check item is still displayed
        cy.get(`#${buildItemCard(idToDelete)}`).should('exist');
      });
    });
  });
});
