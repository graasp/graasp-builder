import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  TREE_MODAL_MY_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../fixtures/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const copyItems = ({ itemIds, toItemPath }) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.wait(TABLE_ITEM_RENDER_TIME);
    cy.get(`${buildItemsTableRowIdAttribute(id)} input`).click();
  });

  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(`#${ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}`).click();
  cy.fillTreeModal(toItemPath);
};

describe('Copy items in List', () => {
  it('Copy items on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    const itemIds = [SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[5].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItems({ itemIds, toItemPath });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      itemIds.forEach((id) => {
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });

      // check in new parent
      cy.goToItemInList(toItem);
      body.forEach((item) => {
        cy.get(`${buildItemsTableRowIdAttribute(item.id)}`).should('exist');
      });
    });
  });

  it('Copy items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // copy
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    copyItems({ itemIds, toItemPath });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      itemIds.forEach((id) => {
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });

      // check in new parent
      cy.goToItemInList(toItem);
      body.forEach((item) => {
        cy.get(`${buildItemsTableRowIdAttribute(item.id)}`).should('exist');
      });
    });
  });

  it('Copy items to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // copy
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    copyItems({ itemIds, toItemPath: TREE_MODAL_MY_ITEMS_ID });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      itemIds.forEach((id) => {
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });

      // check in new parent
      cy.goToHome();
      body.forEach((item) => {
        cy.get(`${buildItemsTableRowIdAttribute(item.id)}`).should('exist');
      });
    });
  });

  describe('Error handling', () => {
    it('error while copying item does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, copyItemError: true });
      const { id: start } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(start));
      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // copy
      const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
      const { path: toItemPath } = SAMPLE_ITEMS.items[0];
      copyItems({ itemIds, toItemPath });

      cy.wait('@copyItems').then(({ response: { body } }) => {
        // check item is still existing in parent
        itemIds.forEach((id) => {
          cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
        });
        body.forEach((item) => {
          cy.get(`${buildItemsTableRowIdAttribute(item.id)}`).should(
            'not.exist',
          );
        });
      });
    });
  });
});
