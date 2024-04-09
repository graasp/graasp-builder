import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const recycleItem = (id: string) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();
};

describe('Recycle Item in Grid', () => {
  it('recycle item on Home', () => {
    const FOLDER = PackedFolderItemFactory();

    cy.setUpApi({ items: [FOLDER] });
    cy.visit(HOME_PATH);
    cy.switchMode(ItemLayoutMode.Grid);

    const { id } = FOLDER;

    // recycle
    recycleItem(id);
    cy.wait(['@recycleItems', '@getAccessibleItems']);
  });

  it('recycle item inside parent', () => {
    const FOLDER = PackedFolderItemFactory();
    const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
    cy.setUpApi({ items: [FOLDER, CHILD] });
    const { id } = FOLDER;
    const { id: idToDelete } = CHILD;

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ItemLayoutMode.Grid);

    // recycle
    recycleItem(idToDelete);
    cy.wait('@recycleItems').then(() => {
      // check update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });
});
