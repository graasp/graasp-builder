import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const recycleItem = (id: string) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(menuSelector).click();
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
    cy.wait('@getOwnItems');
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

  describe('Error handling', () => {
    it('error while recycling item does not recycle in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, recycleItemsError: true });
      const { id } = SAMPLE_ITEMS.items[0];
      const { id: idToDelete } = SAMPLE_ITEMS.items[2];

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // delete
      recycleItem(idToDelete);

      cy.wait('@recycleItems').then(() => {
        // check item is still displayed
        cy.get(buildItemsTableRowIdAttribute(idToDelete)).should('exist');
      });
    });
  });
});
