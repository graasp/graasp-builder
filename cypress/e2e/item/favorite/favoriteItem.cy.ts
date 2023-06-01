import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { FAVORITE_ITEMS_PATH, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowIdAttribute,
  FAVORITE_ITEM_BUTTON_CLASS,
  CREATE_ITEM_BUTTON_ID,
  buildItemMenuButtonId,
  buildItemMenu,
  FAVORITE_ITEMS_ID,
} from '../../../../src/config/selectors';
import {
  buildMemberWithFavorites,
  CURRENT_USER,
} from '../../../fixtures/members';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';
import i18n from '../../../../src/config/i18n';

const toggleFavoriteButton = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(itemId)} .${FAVORITE_ITEM_BUTTON_CLASS}`).click();
};

const favoriteItems = [SAMPLE_ITEMS.items[1].id, SAMPLE_ITEMS.items[2].id];

describe('Favorite Item', () => {
  describe('Member has no favorite items', () => {
    beforeEach(() => {
      cy.setUpApi({
        ...SAMPLE_ITEMS,
      });
      cy.visit(FAVORITE_ITEMS_PATH);
    });

    it('Show empty table', () => {
      cy.get(`#${FAVORITE_ITEMS_ID}`).should('exist');
    });
  });

  describe('Member has several valid favorite items', () => {
    beforeEach(() => {
      cy.setUpApi({
        ...SAMPLE_ITEMS,
        currentMember: buildMemberWithFavorites(favoriteItems),
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      cy.visit(HOME_PATH);
    });

    it("New button doesn't exist", () => {
      cy.visit(FAVORITE_ITEMS_PATH);
      cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');
    });

    it('add item to favorites', () => {
      const item = SAMPLE_ITEMS.items[0];

      toggleFavoriteButton(item.id);

      cy.wait('@editMember').then(
        ({
          request: {
            body: { extra },
          },
        }) => {
          expect(extra.favoriteItems.includes(item.id));
        },
      );
    });

    it('remove item from favorites', () => {
      const itemId = favoriteItems[0];

      toggleFavoriteButton(itemId);

      cy.wait('@editMember').then(
        ({
          request: {
            body: { extra },
          },
        }) => {
          expect(!extra.favoriteItems.includes(itemId));
        },
      );
    });

    it('check favorite items view', () => {
      cy.visit(FAVORITE_ITEMS_PATH);

      const itemId = favoriteItems[0];

      cy.get(buildItemsTableRowIdAttribute(itemId)).should('exist');
    });
  });

  describe('Error Handling', () => {
    it('check favorite items view with multiple deleted item', () => {
      const itemId = 'ecafbd2a-5688-11eb-ae93-2212bc437002';
      cy.setUpApi({
        ...SAMPLE_ITEMS,
        currentMember: buildMemberWithFavorites([itemId, favoriteItems[0]]),
      });
      cy.visit(FAVORITE_ITEMS_PATH);

      // delete non existing id automatically
      cy.wait('@editMember').then(
        ({
          request: {
            body: { extra },
          },
        }) => {
          expect(!extra.favoriteItems.includes(itemId));
        },
      );
    });
  });
});
