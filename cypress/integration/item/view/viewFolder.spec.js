import {
  DEFAULT_ITEM_LAYOUT_MODE,
  GRID_ITEMS_PER_PAGE_CHOICES,
} from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemsTableRowId,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID,
  ITEMS_GRID_NO_ITEM_ID,
  ITEMS_GRID_PAGINATION_ID,
  ITEMS_TABLE_EMPTY_ROW_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { generateOwnItems, SAMPLE_ITEMS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { REQUEST_FAILURE_TIME } from '../../../support/constants';
import { expectFolderViewScreenLayout } from './utils';

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

      expectFolderViewScreenLayout({ item: SAMPLE_ITEMS.items[0] });

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

  describe('Grid pagination', () => {
    const sampleItems = generateOwnItems(30);

    const checkGridPagination = (items, itemsPerPage) => {
      const numberPages = Math.ceil(items.length / itemsPerPage);

      // for each page
      for (let i = 0; i < numberPages; i += 1) {
        // navigate to page
        cy.get(`#${ITEMS_GRID_PAGINATION_ID} > ul > li`)
          .eq(i + 1) // leftmost li is "prev" button
          .click();
        // compute items that should be on this page
        const shouldDisplay = items.slice(
          i * itemsPerPage,
          (i + 1) * itemsPerPage,
        );
        // compute items that should not be on this page
        const shouldNotDisplay = items.filter(
          (it) => !shouldDisplay.includes(it),
        );

        shouldDisplay.forEach((item) => {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        });

        shouldNotDisplay.forEach((item) => {
          cy.get(`#${buildItemCard(item.id)}`).should('not.exist');
        });
      }
    };

    beforeEach(() => {
      // create many items to be shown on Home (more than default itemsPerPage)
      cy.setUpApi({ items: sampleItems });
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.GRID) {
        cy.switchMode(ITEM_LAYOUT_MODES.GRID);
      }

      cy.wait('@getOwnItems');
    });

    it('shows only items of each page', () => {
      // using default items per page count
      checkGridPagination(sampleItems, GRID_ITEMS_PER_PAGE_CHOICES[0]);
    });

    it('selects number of items per page', () => {
      // test every possible value of itemsPerPage count
      GRID_ITEMS_PER_PAGE_CHOICES.forEach((itemsPerPage, i) => {
        // click on itemsPerPage select
        cy.get(`#${ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID}`).click();

        // select ith option in select popover
        const popover = `ul[aria-labelledby="${ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID}"] > li`;
        cy.get(popover).eq(i).click();

        // check pagination display with second items per page count choice
        checkGridPagination(sampleItems, itemsPerPage);
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

      expectFolderViewScreenLayout({ item: SAMPLE_ITEMS.items[0] });

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
