import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const recycleItems = (itemIds) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.wait(TABLE_ITEM_RENDER_TIME);
    cy.get(`${buildItemsTableRowIdAttribute(id)} .ag-checkbox-input`).click();
  });

  cy.get(`#${ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}`).click();
};

describe('Recycle Items in List', () => {
  it('recycle 2 items in Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // delete
    recycleItems([SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[1].id]);
    cy.wait(['@recycleItems', '@getOwnItems']);
  });

  it('recycle 2 items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // delete
    recycleItems([SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[3].id]);
    cy.wait('@recycleItems').then(() => {
      // check item is deleted, others are still displayed
      cy.wait('@getItem')
        .its('response.url')
        .should('contain', SAMPLE_ITEMS.items[0].id);
    });
  });

  describe('Error handling', () => {
    it('does not recycle items on error', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, recycleItemsError: true });
      cy.visit(HOME_PATH);
      const itemIds = [SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[1].id];

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // delete
      recycleItems(itemIds);
      cy.wait('@recycleItems').then(() => {
        // check item is deleted, others are still displayed
        for (const id of itemIds) {
          cy.get(buildItemsTableRowIdAttribute(id)).should('exist');
        }
      });
    });
  });
});
