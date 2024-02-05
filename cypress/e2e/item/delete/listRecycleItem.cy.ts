import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const recycleItem = (id: string) => {
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

describe('Recycle Item in List', () => {
  it('recycle item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    const { id } = SAMPLE_ITEMS.items[0];

    // delete
    recycleItem(id);
    cy.wait('@recycleItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getAccessibleItems');
  });

  it('recycle item inside parent', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    const { id: idToDelete } = SAMPLE_ITEMS.items[2];

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // delete
    recycleItem(idToDelete);
    cy.wait('@recycleItems').then(({ request: { url } }) => {
      expect(url).to.contain(idToDelete);
    });
  });
});
