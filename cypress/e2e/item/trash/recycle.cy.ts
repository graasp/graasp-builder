import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_RECYCLE_BUTTON_CLASS,
  buildItemsGridMoreButtonSelector,
} from '../../../../src/config/selectors';

const recycleItem = (id: string) => {
  cy.get(buildItemsGridMoreButtonSelector(id)).click();
  cy.get(`.${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

const FOLDER = PackedFolderItemFactory();
const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
const items = [FOLDER, CHILD, PackedFolderItemFactory()];

const recycleItems = () => {
  cy.get(`.${ITEM_RECYCLE_BUTTON_CLASS}`).click();
};

describe('Recycle Items', () => {
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

  it('recycle many items from Home', () => {
    const folders = [
      PackedFolderItemFactory(),
      PackedFolderItemFactory(),
      PackedFolderItemFactory(),
    ];
    cy.setUpApi({
      items: folders,
    });

    cy.visit('/');

    folders.forEach((item) => {
      cy.selectItem(item.id);
    });

    recycleItems();

    cy.wait('@recycleItems').then(({ request: { url } }) => {
      folders.forEach((item) => {
        expect(url).to.contain(item.id);
      });
    });
  });

  it('recycle many items from folder', () => {
    const parentItem = PackedFolderItemFactory();
    const folders = [
      PackedFolderItemFactory({ parentItem }),
      PackedFolderItemFactory({ parentItem }),
      PackedFolderItemFactory({ parentItem }),
    ];
    cy.setUpApi({
      items: [...folders, parentItem],
    });

    // go to children item
    cy.visit(buildItemPath(parentItem.id));

    folders.forEach((item) => {
      cy.selectItem(item.id);
    });

    recycleItems();

    cy.wait('@recycleItems').then(({ request: { url } }) => {
      folders.forEach((item) => {
        expect(url).to.contain(item.id);
      });
    });
  });
});
