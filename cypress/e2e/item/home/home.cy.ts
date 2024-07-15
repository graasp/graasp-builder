import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { SortingOptions } from '@/components/table/types';
import { ITEM_PAGE_SIZE } from '@/config/constants';

import i18n from '../../../../src/config/i18n';
import { HOME_PATH, ITEMS_PATH } from '../../../../src/config/paths';
import {
  ACCESSIBLE_ITEMS_ONLY_ME_ID,
  CREATE_ITEM_BUTTON_ID,
  DROPZONE_SELECTOR,
  HOME_LOAD_MORE_BUTTON_SELECTOR,
  ITEM_SEARCH_INPUT_ID,
  SORTING_ORDERING_SELECTOR_ASC,
  SORTING_ORDERING_SELECTOR_DESC,
  SORTING_SELECT_SELECTOR,
  buildItemCard,
  buildMapViewId,
} from '../../../../src/config/selectors';
import { generateOwnItems } from '../../../fixtures/items';
import { CURRENT_USER } from '../../../fixtures/members';
import { NAVIGATION_LOAD_PAUSE } from '../../../support/constants';
import { ItemForTest } from '../../../support/types';

const ownItems = generateOwnItems(30);

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const FOLDER_CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({
  parentItem: FOLDER,
});
const FOLDER2 = PackedFolderItemFactory();

const ITEMS = [IMAGE_ITEM, FOLDER, FOLDER2, FOLDER_CHILD, IMAGE_ITEM_CHILD];

// register a custom one time interceptor to listen specifically
// to the request made with the search parameter we want
const interceptAccessibleItemsSearch = (searchTerm: string) =>
  cy
    .intercept({
      pathname: `/${ITEMS_PATH}/accessible`,
      query: { name: searchTerm },
    })
    .as('getAccessibleSearch');

describe('Home', () => {
  it('visit Home on map by default', () => {
    cy.setUpApi({
      items: generateOwnItems(30),
    });
    cy.visit(`${HOME_PATH}?mode=map`);

    cy.get(`#${buildMapViewId()}`, { timeout: 10000 }).should('be.visible');
  });

  it('visit empty Home', () => {
    cy.setUpApi({
      items: [],
    });

    cy.visit(HOME_PATH);
    cy.get(`[role="dropzone"]`).should('be.visible');
    cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('be.visible');
  });

  describe('Features', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: generateOwnItems(30),
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      cy.visit(HOME_PATH);
    });

    it('Enabling show only created by me should trigger refetch', () => {
      cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
        expect(url).not.to.contain(CURRENT_USER.id);
      });

      cy.get(`#${ACCESSIBLE_ITEMS_ONLY_ME_ID}`).click();

      cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
        expect(url).to.contain(CURRENT_USER.id);
      });
    });

    it('Sorting & ordering', () => {
      cy.wait('@getAccessibleItems');

      cy.get(`${SORTING_SELECT_SELECTOR} input`).should(
        'have.value',
        SortingOptions.ItemUpdatedAt,
      );
      cy.get(SORTING_ORDERING_SELECTOR_DESC).should('be.visible');

      // change sorting
      cy.get(SORTING_SELECT_SELECTOR).click();
      cy.get('li[data-value="item.name"]').click();
      cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
        expect(url).to.contain('item.name');
        expect(url).to.contain('desc');
      });

      // change ordering
      cy.get(SORTING_ORDERING_SELECTOR_DESC).click();
      cy.get(SORTING_ORDERING_SELECTOR_ASC).should('be.visible');
      cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
        expect(url).to.contain('asc');
      });
    });

    describe('Search', () => {
      it('Search should trigger refetch', () => {
        cy.wait('@getAccessibleItems');

        const searchText = 'mysearch';
        cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

        cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
          expect(url).to.contain(searchText);
        });
      });

      it('Search on second page should reset page number', () => {
        const searchText = 'mysearch';
        interceptAccessibleItemsSearch(searchText);

        cy.wait('@getAccessibleItems');
        // navigate to second page
        cy.get(HOME_LOAD_MORE_BUTTON_SELECTOR).click();

        cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
          expect(url).to.contain('page=2');
        });
        cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

        // using our custom interceptor with the search parameter we can distinguish the complete
        // search request from possibly other incomplete search requests
        cy.wait('@getAccessibleSearch').then(({ request: { query } }) => {
          expect(query.name).to.eq(searchText);
          expect(query.page).to.eq('1');
        });
        cy.get(`#${buildItemCard(ownItems[0].id)}`).should('be.visible');
      });
    });

    describe('Pagination', () => {
      const checkGridPagination = (
        items: ItemForTest[],
        itemsPerPage: number = ITEM_PAGE_SIZE,
      ) => {
        const numberPages = Math.ceil(items.length / itemsPerPage);
        // for each page
        for (let i = 0; i < numberPages; i += 1) {
          // compute items that should be on this page
          const shouldDisplay = items.slice(0, (i + 1) * itemsPerPage);

          shouldDisplay.forEach((item) => {
            cy.get(`#${buildItemCard(item.id)}`).should('exist');
          });

          // navigate to page
          // button does not exist for last "page"
          if (i !== numberPages - 1) {
            cy.get(HOME_LOAD_MORE_BUTTON_SELECTOR).click();
          }
        }
      };

      it('shows only items of each page', () => {
        // using default items per page count
        checkGridPagination(ownItems);
      });
    });
  });

  describe('Navigation', () => {
    it('visit Home', () => {
      cy.setUpApi({ items: ITEMS });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      cy.visit(HOME_PATH);

      cy.wait('@getAccessibleItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body.data) {
          cy.get(`#${buildItemCard(item.id)}`).should('be.visible');
        }
      });

      // visit child
      const { id: childId } = FOLDER;
      cy.goToItemInCard(childId);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('be.visible');
        }
      });

      // visit child
      const { id: childChildId } = FOLDER_CHILD;
      cy.goToItemInCard(childChildId);

      // expect dropzone
      cy.get(DROPZONE_SELECTOR).should('exist');

      // return parent with navigation and should display children
      cy.wait(NAVIGATION_LOAD_PAUSE);
      cy.goToItemWithNavigation(childId);
      // should get children
      cy.wait('@getChildren').then(() => {
        // check item is created and displayed
        for (const item of [IMAGE_ITEM_CHILD, FOLDER_CHILD]) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
    });
  });
});
