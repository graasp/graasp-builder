import { getParentsIdsFromPath } from '@/utils/item';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  buildItemCard,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const duplicateItem = ({ id }: { id: string }) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_DUPLICATE_BUTTON_CLASS}`).click();
};

describe('Duplicate Item in Grid', () => {
  it('Duplicate item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // Duplicate
    const { id: duplicateItemId } = SAMPLE_ITEMS.items[0];
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      cy.get(`#${buildItemCard(duplicateItemId)}`).should('exist');
      expect(url).to.contain(duplicateItemId);
    });
  });

  it('Duplicate item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id, path } = SAMPLE_ITEMS.items[0];
    const parentsIds = getParentsIdsFromPath(path);

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // Duplicate
    const { id: duplicateItemId } = SAMPLE_ITEMS.items[2];
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      cy.get(`#${buildItemCard(duplicateItemId)}`).should('exist');
      expect(body.parentId).to.equal(parentsIds[0]);
      expect(url).to.contain(duplicateItemId);
    });
  });
});
