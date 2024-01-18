import { getParentsIdsFromPath } from '@/utils/item';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import duplicateItem from '../../../support/actionsUtils';

describe('Duplicate Item in Grid', () => {
  it('Duplicate item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // Duplicate
    const { id: duplicateItemId } = SAMPLE_ITEMS.items[0];
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(url).to.contain(duplicateItemId);
      // as we duplicate on home parentId will be undefined
      expect(body.parentId).to.equal(undefined);
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
      expect(body.parentId).to.equal(parentsIds[0]);
      expect(url).to.contain(duplicateItemId);
    });
  });
});
