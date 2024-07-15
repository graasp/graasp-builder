import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  buildItemsGridMoreButtonSelector,
} from '../../../../src/config/selectors';

const recycleItem = (id: string) => {
  cy.get(buildItemsGridMoreButtonSelector(id)).click();
  cy.get(`.${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

const FOLDER = PackedFolderItemFactory();
const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
const items = [FOLDER, CHILD, PackedFolderItemFactory()];

describe('Recycle Item', () => {
  it('recycle item on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    const { id } = items[0];

    recycleItem(id);
    cy.wait('@recycleItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getAccessibleItems');
  });

  it('recycle item inside parent', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;
    const { id: idToDelete } = CHILD;

    // go to children item
    cy.visit(buildItemPath(id));

    // delete
    recycleItem(idToDelete);
    cy.wait('@recycleItems').then(({ request: { url } }) => {
      expect(url).to.contain(idToDelete);
    });
  });
});
