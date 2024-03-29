import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const recycleItem = (id: string) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

describe('Recycle Item in Grid', () => {
  it('recycle item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ItemLayoutMode.Grid);

    const { id } = SAMPLE_ITEMS.items[0];

    // recycle
    recycleItem(id);
    cy.wait(['@recycleItems', '@getAccessibleItems']);
  });

  it('recycle item inside parent', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    const { id: idToDelete } = SAMPLE_ITEMS.items[2];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ItemLayoutMode.Grid);

    // recycle
    recycleItem(idToDelete);
    cy.wait('@recycleItems').then(() => {
      // check update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });
});
