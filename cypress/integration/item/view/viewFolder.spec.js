import { BUILDER, namespaces } from '@graasp/translations';

import {
  DEFAULT_ITEM_LAYOUT_MODE,
  GRID_ITEMS_PER_PAGE_CHOICES,
} from '../../../../src/config/constants';
import i18n from '../../../../src/config/i18n';
import {
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../../../src/config/paths';
import {
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID,
  ITEMS_GRID_NO_ITEM_ID,
  ITEMS_GRID_PAGINATION_ID,
  ITEMS_TABLE_ROW,
  NAVIGATION_HOME_LINK_ID,
  NAVIGATION_ROOT_ID,
  buildItemCard,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { SAMPLE_ITEMS, generateOwnItems } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { CURRENT_USER } from '../../../fixtures/members';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';
import { NAVIGATION_LOAD_PAUSE } from '../../../support/constants';
import { expectFolderViewScreenLayout } from './utils';

const t = (key) => i18n.t(key, { ns: namespaces.builder });

describe('View Folder', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          ...SAMPLE_ITEMS.items,
          ...SHARED_ITEMS.items,
          GRAASP_LINK_ITEM,
          IMAGE_ITEM_DEFAULT,
          VIDEO_ITEM_S3,
        ],
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang);
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

      // root title
      cy.get(`#${NAVIGATION_ROOT_ID}`).should(
        'have.text',
        t(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
      );

      // visit child
      const { id: childChildId } = SAMPLE_ITEMS.items[2];
      cy.goToItemInGrid(childChildId);

      // expect no children
      cy.get(`#${ITEMS_GRID_NO_ITEM_ID}`).should('exist');

      // root title
      cy.get(`#${NAVIGATION_ROOT_ID}`).should(
        'have.text',
        t(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
      );

      // return parent with navigation and should display children
      cy.wait(NAVIGATION_LOAD_PAUSE);
      cy.goToItemWithNavigation(childId);
      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
      // root title
      cy.get(`#${NAVIGATION_ROOT_ID}`).should(
        'have.text',
        t(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
      );
    });

    it('visit Shared Items', () => {
      cy.visit(SHARED_ITEMS_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // should get own items
      cy.wait('@getSharedItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // visit child
      const { id: childId } = SHARED_ITEMS.items[0];
      cy.goToItemInGrid(childId);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // breadcrumb navigation
      cy.get(`#${NAVIGATION_ROOT_ID}`).should(
        'have.text',
        t(BUILDER.NAVIGATION_SHARED_ITEMS_TITLE),
      );
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
          cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
        }
      });

      // visit child
      const { id: childId } = SAMPLE_ITEMS.items[0];
      cy.goToItemInList(childId);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
        }
      });

      // visit child
      const { id: childChildId } = SAMPLE_ITEMS.items[2];
      cy.goToItemInList(childChildId);

      // expect no children
      cy.get(ITEMS_TABLE_ROW).should('not.exist');

      // return parent with navigation and should display children
      cy.goToItemWithNavigation(childId);
      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
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
          cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
        }
      });

      // visit home
      cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();

      // should get own items
      cy.wait('@getOwnItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
        }
      });
    });
  });
});
