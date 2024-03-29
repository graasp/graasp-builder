import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const recycleItems = (itemIds: string[]) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}`).click();
};

describe('Recycle Items in List', () => {
  it('recycle 2 items in Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // delete
    recycleItems([SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[1].id]);
    cy.wait(['@recycleItems', '@getAccessibleItems']);
  });

  it('recycle 2 items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));

    cy.switchMode(ItemLayoutMode.List);

    // delete
    recycleItems([SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[3].id]);
    cy.wait('@recycleItems').then(() => {
      // check item is deleted, others are still displayed
      cy.wait('@getItem')
        .its('response.url')
        .should('contain', SAMPLE_ITEMS.items[0].id);
    });
  });
});
