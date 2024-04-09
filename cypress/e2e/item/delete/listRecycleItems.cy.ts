import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const recycleItems = (itemIds: string[]) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}`).click();
};

const FOLDER = PackedFolderItemFactory();
const PARENT = PackedFolderItemFactory();
const CHILD1 = PackedFolderItemFactory({ parentItem: PARENT });
const CHILD2 = PackedFolderItemFactory({ parentItem: PARENT });
const items = [FOLDER, PARENT, CHILD1, CHILD2];

describe('Recycle Items in List', () => {
  it('recycle 2 items in Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // delete
    recycleItems([FOLDER.id, PARENT.id]);
    cy.wait(['@recycleItems', '@getAccessibleItems']);
  });

  it('recycle 2 items in item', () => {
    cy.setUpApi({ items });
    cy.visit(buildItemPath(PARENT.id));

    cy.switchMode(ItemLayoutMode.List);

    // delete
    recycleItems([CHILD1.id, CHILD2.id]);
    cy.wait('@recycleItems').then(() => {
      // check item is deleted, others are still displayed
      cy.wait('@getItem').its('response.url').should('contain', PARENT.id);
    });
  });
});
