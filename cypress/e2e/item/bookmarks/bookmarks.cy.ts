import {
  PackedFolderItemFactory,
  PackedItemBookmarkFactory,
} from '@graasp/sdk';

import i18n from '../../../../src/config/i18n';
import { BOOKMARKED_ITEMS_PATH, HOME_PATH } from '../../../../src/config/paths';
import {
  BOOKMARKED_ITEMS_ID,
  BOOKMARKED_ITEM_BUTTON_CLASS,
  CREATE_ITEM_BUTTON_ID,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { CURRENT_USER } from '../../../fixtures/members';

const BOOKMARKED_ITEMS = [
  PackedItemBookmarkFactory(),
  PackedItemBookmarkFactory(),
];
const ITEMS = BOOKMARKED_ITEMS.map(({ item }) => item);
const NON_BOOKMARKED_ITEM = PackedFolderItemFactory();

const toggleBookmarkButton = (itemId: string) => {
  // todo: remove when refactoring the table
  cy.wait(500);
  cy.get(`#${buildItemMenuButtonId(itemId)}`).click();
  cy.get(`#${buildItemMenu(itemId)} .${BOOKMARKED_ITEM_BUTTON_CLASS}`).click();
};

describe('Bookmarked Item', () => {
  describe('Member has no bookmarked items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: ITEMS,
        bookmarkedItems: BOOKMARKED_ITEMS,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);
    });

    it('Show empty table', () => {
      cy.get(`#${BOOKMARKED_ITEMS_ID}`).should('exist');
    });
  });

  describe('Member has several valid bookmarked items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [...ITEMS, NON_BOOKMARKED_ITEM],
        bookmarkedItems: BOOKMARKED_ITEMS,
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      cy.visit(HOME_PATH);
    });

    it("New button doesn't exist", () => {
      cy.visit(BOOKMARKED_ITEMS_PATH);
      cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');
    });

    it('add item to bookmarks', () => {
      const item = NON_BOOKMARKED_ITEM;

      toggleBookmarkButton(item.id);

      cy.wait('@bookmarkItem').then(({ request }) => {
        expect(request.url).to.contain(item.id);
      });
    });

    it('remove item from bookmarks', () => {
      const itemId = ITEMS[1].id;

      toggleBookmarkButton(itemId);

      cy.wait('@unbookmarkItem').then(({ request }) => {
        expect(request.url).to.contain(itemId);
      });
    });

    it('check bookmarked items view', () => {
      cy.visit(BOOKMARKED_ITEMS_PATH);

      const itemId = ITEMS[1].id;

      cy.get(buildItemsTableRowIdAttribute(itemId)).should('exist');
    });
  });

  describe('Error Handling', () => {
    it('check bookmarked items view with server error', () => {
      cy.setUpApi({
        items: ITEMS,
        getFavoriteError: true,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);

      it('Show empty table', () => {
        cy.get(`#${BOOKMARKED_ITEMS_ID}`).should('exist');
      });
    });
  });
});
