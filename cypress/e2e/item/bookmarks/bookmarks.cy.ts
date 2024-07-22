import {
  PackedFolderItemFactory,
  PackedItemBookmarkFactory,
} from '@graasp/sdk';

import { SortingOptions } from '@/components/table/types';
import { BUILDER } from '@/langs/constants';

import i18n, { BUILDER_NAMESPACE } from '../../../../src/config/i18n';
import { BOOKMARKED_ITEMS_PATH, HOME_PATH } from '../../../../src/config/paths';
import {
  BOOKMARKED_ITEMS_ERROR_ALERT_ID,
  BOOKMARKED_ITEMS_ID,
  BOOKMARK_ICON_SELECTOR,
  CREATE_ITEM_BUTTON_ID,
  ITEM_SEARCH_INPUT_ID,
  SORTING_ORDERING_SELECTOR_ASC,
  SORTING_ORDERING_SELECTOR_DESC,
  SORTING_SELECT_SELECTOR,
  UNBOOKMARK_ICON_SELECTOR,
  buildItemCard,
} from '../../../../src/config/selectors';
import { CURRENT_USER } from '../../../fixtures/members';

const BOOKMARKED_ITEMS = [
  PackedItemBookmarkFactory(),
  PackedItemBookmarkFactory(),
];
const ITEMS = BOOKMARKED_ITEMS.map(({ item }) => item);
const NON_BOOKMARKED_ITEM = PackedFolderItemFactory();

const removefromBookmark = (itemId: string) => {
  cy.get(`#${buildItemCard(itemId)} ${UNBOOKMARK_ICON_SELECTOR}`).click();
};

const addToBookmark = (itemId: string) => {
  cy.get(`#${buildItemCard(itemId)} ${BOOKMARK_ICON_SELECTOR}`).click();
};

describe('Bookmarked Item', () => {
  describe('Member has no bookmarked items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: ITEMS,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);
    });

    it('Show empty table', () => {
      i18n.changeLanguage(CURRENT_USER.extra.lang);
      const text = i18n.t(BUILDER.BOOKMARKS_NO_ITEM, { ns: BUILDER_NAMESPACE });
      cy.get(`#${BOOKMARKED_ITEMS_ID}`).should('contain', text);
    });
  });

  describe('Member has bookmarked items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [...ITEMS, NON_BOOKMARKED_ITEM],
        bookmarkedItems: BOOKMARKED_ITEMS,
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang);
      cy.visit(BOOKMARKED_ITEMS_PATH);
    });

    it('Empty search', () => {
      const searchText = 'mysearch';
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);
      const text = i18n.t(BUILDER.BOOKMARKS_NO_ITEM_SEARCH, {
        search: searchText,
        ns: BUILDER_NAMESPACE,
      });
      cy.get(`#${BOOKMARKED_ITEMS_ID}`).should('contain', text);
    });

    it("New button doesn't exist", () => {
      cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');
    });

    it('Check bookmarked items view', () => {
      for (const { item } of BOOKMARKED_ITEMS) {
        cy.get(`#${buildItemCard(item.id)}`).should('be.visible');
      }
    });

    it.only('Add item to bookmarks', () => {
      cy.visit(HOME_PATH);

      const item = NON_BOOKMARKED_ITEM;

      addToBookmark(item.id);

      cy.wait('@bookmarkItem').then(({ request }) => {
        expect(request.url).to.contain(item.id);
      });
    });

    it('remove item from bookmarks', () => {
      const itemId = ITEMS[1].id;

      removefromBookmark(itemId);

      cy.wait('@unbookmarkItem').then(({ request }) => {
        expect(request.url).to.contain(itemId);
      });
    });

    it('Sorting & Ordering', () => {
      cy.get(`${SORTING_SELECT_SELECTOR} input`).should(
        'have.value',
        SortingOptions.ItemUpdatedAt,
      );
      cy.get(SORTING_ORDERING_SELECTOR_DESC).should('be.visible');

      cy.get(SORTING_SELECT_SELECTOR).click();
      cy.get('li[data-value="item.name"]').click();

      // check items are ordered by name
      cy.get(`#${BOOKMARKED_ITEMS_ID} h5`).then(($e) => {
        BOOKMARKED_ITEMS.sort((a, b) => (a.item.name < b.item.name ? 1 : -1));
        for (let idx = 0; idx < BOOKMARKED_ITEMS.length; idx += 1) {
          expect($e[idx].innerText).to.eq(BOOKMARKED_ITEMS[idx].item.name);
        }
      });

      // change ordering
      cy.get(SORTING_ORDERING_SELECTOR_DESC).click();
      cy.get(SORTING_ORDERING_SELECTOR_ASC).should('be.visible');
      cy.get(`#${BOOKMARKED_ITEMS_ID} h5`).then(($e) => {
        BOOKMARKED_ITEMS.reverse();
        for (let idx = 0; idx < BOOKMARKED_ITEMS.length; idx += 1) {
          expect($e[idx].innerText).to.eq(BOOKMARKED_ITEMS[idx].item.name);
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('check bookmarked items view with server error', () => {
      cy.setUpApi({
        items: ITEMS,
        getFavoriteError: true,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);

      cy.get(`#${BOOKMARKED_ITEMS_ERROR_ALERT_ID}`).should('exist');
    });
  });
});
