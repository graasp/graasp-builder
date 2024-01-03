import { getParentsIdsFromPath } from '@/utils/item';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import duplicateItem from '../../../support/actionsUtils';

describe('duplicate Item in Home', () => {
  Object.values(ITEM_LAYOUT_MODES).forEach((view) => {
    it(`duplicate item on Home in ${view} view`, () => {
      cy.setUpApi(SAMPLE_ITEMS);
      cy.visit(HOME_PATH);
      cy.switchMode(view);

      // duplicate
      const { id: duplicateItemId } = SAMPLE_ITEMS.items[0];
      duplicateItem({ id: duplicateItemId });

      cy.wait('@copyItems').then(({ request: { url, body } }) => {
        expect(url).to.contain(duplicateItemId);
        // as we duplicate on home parentId will be undefined
        expect(body.parentId).to.equal(undefined);
      });
    });
  });
});
describe('duplicate Item in item', () => {
  Object.values(ITEM_LAYOUT_MODES).forEach((view) => {
    it(`duplicate item in item in ${view} view`, () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id, path } = SAMPLE_ITEMS.items[0];
      const parentsIds = getParentsIdsFromPath(path);

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(view);

      // duplicate
      const { id: duplicateItemId } = SAMPLE_ITEMS.items[2];
      duplicateItem({ id: duplicateItemId });

      cy.wait('@copyItems').then(({ request: { url, body } }) => {
        expect(url).to.contain(duplicateItemId);
        expect(body.parentId).to.equal(parentsIds[0]);
      });
    });
  });
});
