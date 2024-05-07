import { PackedFolderItemFactory } from '@graasp/sdk';

import { getParentsIdsFromPath } from '@/utils/item';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import duplicateItem from '../../../support/actionsUtils';

describe('duplicate Item in Home', () => {
  Object.values([ItemLayoutMode.Grid, ItemLayoutMode.List]).forEach((view) => {
    it(`duplicate item on Home in ${view} view`, () => {
      const FOLDER = PackedFolderItemFactory();
      cy.setUpApi({ items: [FOLDER] });
      cy.visit(HOME_PATH);
      cy.switchMode(view);

      // duplicate
      const { id: duplicateItemId } = FOLDER;
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
  Object.values([ItemLayoutMode.Grid, ItemLayoutMode.List]).forEach((view) => {
    it(`duplicate item in item in ${view} view`, () => {
      const FOLDER = PackedFolderItemFactory();
      const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
      cy.setUpApi({ items: [FOLDER, CHILD] });
      const { id, path } = FOLDER;
      const parentsIds = getParentsIdsFromPath(path);

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(view);

      // duplicate
      const { id: duplicateItemId } = CHILD;
      duplicateItem({ id: duplicateItemId });

      cy.wait('@copyItems').then(({ request: { url, body } }) => {
        expect(url).to.contain(duplicateItemId);
        expect(body.parentId).to.equal(parentsIds[0]);
      });
    });
  });
});
