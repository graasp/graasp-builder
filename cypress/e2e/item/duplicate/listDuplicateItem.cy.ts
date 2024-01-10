import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const duplicateItem = ({ id }: { id: string }) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_DUPLICATE_BUTTON_CLASS}`).click();
};

describe('duplicate Item in List', () => {
  it('duplicate item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // duplicate
    const { id: duplicateItemId } = SAMPLE_ITEMS.items[0];
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(duplicateItemId);
      cy.get(buildItemsTableRowIdAttribute(duplicateItemId)).should('exist');
    });
  });

  it('duplicate item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // duplicate
    const { id: duplicateItemId } = SAMPLE_ITEMS.items[2];
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(duplicateItemId);
      cy.get(buildItemsTableRowIdAttribute(duplicateItemId)).should('exist');
    });
  });
});
