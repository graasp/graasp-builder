import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { FAVORITE_ITEMS_PATH, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  FAVORITE_ITEM_BUTTON_CLASS,
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  CREATE_ITEM_BUTTON_ID,
} from '../../../../src/config/selectors';
import { buildMemberWithFavorites } from '../../../fixtures/members';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const toggleFavoriteButton = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(
    `#${buildItemsTableRowId(itemId)} .${FAVORITE_ITEM_BUTTON_CLASS}`,
  ).click();
};

const favoriteItems = [SAMPLE_ITEMS.items[1].id, SAMPLE_ITEMS.items[2].id];

describe('Favorite Item', () => {
  describe('Member has several valid favorite items', () => {
    beforeEach(() => {
      cy.setUpApi({
        ...SAMPLE_ITEMS,
        currentMember: buildMemberWithFavorites(favoriteItems),
      });
      cy.visit(HOME_PATH);
    });

    it('New button doesn\'t exists', () => { 
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

      cy.get(`#${buildItemsTableRowId(itemId)}`).should('exist');
    });
  });

  describe('Error Handling', () => {
    it('check favorite items view with one deleted item', () => {
      const itemId = 'non existing id';
      cy.setUpApi({
        ...SAMPLE_ITEMS,
        currentMember: buildMemberWithFavorites([itemId]),
      });
      cy.visit(FAVORITE_ITEMS_PATH);

      cy.get(`#${FAVORITE_ITEMS_ERROR_ALERT_ID}`).should('exist');
    });

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
