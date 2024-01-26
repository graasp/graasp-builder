import i18n, { BUILDER_NAMESPACE } from '../../../../src/config/i18n';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  ACCESSIBLE_ITEMS_NEXT_PAGE_BUTTON_SELECTOR,
  ACCESSIBLE_ITEMS_ONLY_ME_ID,
  ITEMS_GRID_NO_ITEM_ID,
  ITEMS_GRID_PAGINATION_ID,
  ITEMS_TABLE_ROW,
  ITEM_SEARCH_INPUT_ID,
  NAVIGATION_ROOT_ID,
  buildItemCard,
  buildItemsTableRowIdAttribute,
  buildItemsTableRowSelector,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { BUILDER } from '../../../../src/langs/constants';
import { SAMPLE_ITEMS, generateOwnItems } from '../../../fixtures/items';
import { CURRENT_USER } from '../../../fixtures/members';
import {
  NAVIGATION_LOAD_PAUSE,
  TABLE_ITEM_RENDER_TIME,
} from '../../../support/constants';
import { ItemForTest } from '../../../support/types';

const translateBuilder = (key: string) =>
  i18n.t(key, { ns: BUILDER_NAMESPACE });

const sampleItems = generateOwnItems(30);

describe('Home', () => {
  describe('Grid', () => {
    describe('Features', () => {
      beforeEach(() => {
        cy.setUpApi({
          items: sampleItems,
        });
        i18n.changeLanguage(CURRENT_USER.extra.lang as string);
        cy.visit(HOME_PATH);
        cy.switchMode(ITEM_LAYOUT_MODES.GRID);
      });

      it('Show only created by me checkbox should trigger refetch', () => {
        cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
          expect(url).not.to.contain(CURRENT_USER.id);
        });

        cy.get(`#${ACCESSIBLE_ITEMS_ONLY_ME_ID}`).click();

        cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
          expect(url).to.contain(CURRENT_USER.id);
        });
      });

      describe('Search', () => {
        it('Search should trigger refetch', () => {
          const searchText = 'mysearch';
          cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

          cy.wait(['@getAccessibleItems', '@getAccessibleItems']).then(
            ([
              _first,
              {
                request: { url },
              },
            ]) => {
              expect(url).to.contain(searchText);
            },
          );
        });

        it('Search on second page should reset page number', () => {
          const searchText = 'mysearch';
          cy.wait('@getAccessibleItems');
          // navigate to seconde page
          cy.get(`#${ITEMS_GRID_PAGINATION_ID} > ul > li`).eq(2).click();

          cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
            expect(url).to.contain('page=2');
          });
          cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

          cy.wait('@getAccessibleItems')
            .its('request.url')
            .should('contain', 'page=1');
          cy.wait('@getAccessibleItems')
            .its('request.url')
            .should('contain', searchText);
        });
      });

      describe('Pagination', () => {
        const checkGridPagination = (
          items: ItemForTest[],
          itemsPerPage: number = 10,
        ) => {
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

        it('shows only items of each page', () => {
          // using default items per page count
          checkGridPagination(sampleItems);
        });
      });
    });

    describe('Navigation', () => {
      beforeEach(() => {
        cy.setUpApi(SAMPLE_ITEMS);
        i18n.changeLanguage(CURRENT_USER.extra.lang as string);
        cy.visit(HOME_PATH);
        cy.switchMode(ITEM_LAYOUT_MODES.GRID);
      });

      it('visit Home', () => {
        cy.wait('@getAccessibleItems').then(({ response: { body } }) => {
          cy.wait('@getItemMemberships');
          // check item is created and displayed
          for (const item of body.data) {
            cy.get(`#${buildItemCard(item.id)}`).should('exist');
          }
        });

        // visit child
        const { id: childId } = SAMPLE_ITEMS.items[0];
        cy.goToItemInGrid(childId);

        // should get children
        cy.wait('@getChildren', { timeout: TABLE_ITEM_RENDER_TIME }).then(
          ({ response: { body } }) => {
            // check item is created and displayed
            for (const item of body) {
              cy.get(`#${buildItemCard(item.id)}`).should('exist');
            }
          },
        );

        // root title
        cy.get(`#${NAVIGATION_ROOT_ID}`).contains(
          translateBuilder(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
        );

        // visit child
        const { id: childChildId } = SAMPLE_ITEMS.items[3];
        cy.goToItemInGrid(childChildId);

        // expect no children
        cy.get(`#${ITEMS_GRID_NO_ITEM_ID}`).should('exist');

        // root title
        cy.get(`#${NAVIGATION_ROOT_ID}`).contains(
          translateBuilder(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
        );

        // return parent with navigation and should display children
        cy.wait(NAVIGATION_LOAD_PAUSE);
        cy.goToItemWithNavigation(childId);
        // should get children
        cy.wait('@getChildren').then(() => {
          // check item is created and displayed
          for (const item of [
            SAMPLE_ITEMS.items[2],
            SAMPLE_ITEMS.items[3],
            SAMPLE_ITEMS.items[4],
          ]) {
            cy.get(`#${buildItemCard(item.id)}`).should('exist');
          }
        });
        // root title
        cy.get(`#${NAVIGATION_ROOT_ID}`).contains(
          translateBuilder(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
        );
      });
    });
  });

  describe('List', () => {
    describe('Navigation', () => {
      beforeEach(() => {
        cy.setUpApi(SAMPLE_ITEMS);
        cy.visit(HOME_PATH);
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      });

      it('visit Home', () => {
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
        const { id: childChildId } = SAMPLE_ITEMS.items[3];
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
    });

    describe('Features', () => {
      beforeEach(() => {
        cy.setUpApi({
          items: sampleItems,
        });
        cy.visit(HOME_PATH);
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      });

      it('Show only created by me checkbox should trigger refetch', () => {
        cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
          expect(url).not.to.contain(CURRENT_USER.id);
        });

        cy.get(`#${ACCESSIBLE_ITEMS_ONLY_ME_ID}`).click();

        cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
          expect(url).to.contain(CURRENT_USER.id);
        });
      });

      describe('Search', () => {
        it('Search should trigger refetch', () => {
          const searchText = 'mysearch';
          cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

          cy.wait(['@getAccessibleItems', '@getAccessibleItems']).then(
            ([
              _first,
              {
                request: { url },
              },
            ]) => {
              expect(url).to.contain(searchText);
            },
          );
        });

        it('Search on second page should reset page number', () => {
          const searchText = 'mysearch';
          cy.wait('@getAccessibleItems');
          // navigate to second page
          cy.get(ACCESSIBLE_ITEMS_NEXT_PAGE_BUTTON_SELECTOR).click();

          cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
            expect(url).to.contain('page=2');
          });
          cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

          cy.wait(['@getAccessibleItems', '@getAccessibleItems']).then(
            ([
              _unused,
              {
                request: { url },
              },
            ]) => {
              expect(url).to.contain(searchText);
              expect(url).to.contain('page=1');
            },
          );
        });
      });

      describe('Pagination', () => {
        const itemsPerPage = 10;
        const items = generateOwnItems(30);
        const numberPages = Math.ceil(items.length / itemsPerPage);

        it('shows only items of each page', () => {
          // for each page
          for (let i = 0; i < numberPages; i += 1) {
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
              cy.get(buildItemsTableRowSelector(item.id)).should('exist');
            });

            shouldNotDisplay.forEach((item) => {
              cy.get(buildItemsTableRowSelector(item.id)).should('not.exist');
            });
            // navigate to next page
            if (i !== numberPages - 1) {
              cy.get(ACCESSIBLE_ITEMS_NEXT_PAGE_BUTTON_SELECTOR).click();
            }
          }
        });
      });
    });
  });
});
