import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const recycleItem = (id: string) => {
  // I need this wait because the table reloads and I lose the menu
  // todo: remove on table refactor
  cy.wait(500);
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

const FOLDER = PackedFolderItemFactory();
const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
const items = [FOLDER, CHILD, PackedFolderItemFactory()];

describe('Recycle Item in List', () => {
  it('recycle item on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    const { id } = items[0];

    // delete
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

    cy.switchMode(ItemLayoutMode.List);

    // delete
    recycleItem(idToDelete);
    cy.wait('@recycleItems').then(({ request: { url } }) => {
      expect(url).to.contain(idToDelete);
    });
  });
});
