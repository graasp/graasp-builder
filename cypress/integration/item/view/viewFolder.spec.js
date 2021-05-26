import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemsTableRowId,
  ITEMS_GRID_NO_ITEM_ID,
  ITEMS_TABLE_EMPTY_ROW_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { REQUEST_FAILURE_TIME } from '../../../support/constants';

describe('View Space', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          ...SAMPLE_ITEMS.items,
          GRAASP_LINK_ITEM,
          IMAGE_ITEM_DEFAULT,
          VIDEO_ITEM_S3,
        ],
      });
    });

    it('visit Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // should get own items
      cy.wait('@getOwnItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // visit child
      const { id: childId } = SAMPLE_ITEMS.items[0];
      cy.goToItemInGrid(childId);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // visit child
      const { id: childChildId } = SAMPLE_ITEMS.items[2];
      cy.goToItemInGrid(childChildId);

      // expect no children
      cy.get(`#${ITEMS_GRID_NO_ITEM_ID}`).should('exist');

      // return parent with navigation and should display children
      cy.goToItemWithNavigation(childId);
      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
    });

    it('visit item by id', () => {
      const { id } = SAMPLE_ITEMS.items[0];
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // should get current item
      cy.wait('@getItem');

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // visit home
      cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();

      // should get own items
      cy.wait('@getOwnItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
    });
  });
  describe('List', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          ...SAMPLE_ITEMS.items,
          GRAASP_LINK_ITEM,
          IMAGE_ITEM_DEFAULT,
          VIDEO_ITEM_S3,
        ],
      });
    });

    it('visit Home', () => {
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // should get own items
      cy.wait('@getOwnItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
        }
      });

      // visit child
      const { id: childId } = SAMPLE_ITEMS.items[0];
      cy.goToItemInList(childId);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
        }
      });

      // visit child
      const { id: childChildId } = SAMPLE_ITEMS.items[2];
      cy.goToItemInList(childChildId);

      // expect no children
      cy.get(`#${ITEMS_TABLE_EMPTY_ROW_ID}`).should('exist');

      // return parent with navigation and should display children
      cy.goToItemWithNavigation(childId);
      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
        }
      });
    });

    it('visit folder by id', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // should get current item
      cy.wait('@getItem');

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
        }
      });

      // visit home
      cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();

      // should get own items
      cy.wait('@getOwnItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
        }
      });
    });
  });

  describe('Error Handling', () => {
    // an item might either not exist or not be accessible
    it('visiting non-existing item display error', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, getItemError: true });
      cy.visit(buildItemPath('ecafbd2a-5688-22ac-ae93-0242ac130002'));

      // should get current item
      cy.wait('@getItem').then(() => {
        // wait for request to fail
        cy.wait(REQUEST_FAILURE_TIME);
        cy.get(`#${ITEM_SCREEN_ERROR_ALERT_ID}`).should('exist');
      });
    });
  });
});
