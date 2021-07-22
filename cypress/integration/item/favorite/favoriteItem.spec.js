import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { FAVORITE_ITEMS_PATH, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  FAVORITE_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { buildMemberWithFavorites } from '../../../fixtures/members';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const toggleFavoriteButton = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(
    `#${buildItemsTableRowId(itemId)} .${FAVORITE_ITEM_BUTTON_CLASS}`,
  ).click();
};

const favoriteItems = [SAMPLE_ITEMS.items[1].id];

describe('Favorite Item', () => {
  beforeEach(() => {
    cy.setUpApi({
      ...SAMPLE_ITEMS,
      currentMember: buildMemberWithFavorites(favoriteItems),
    });
    cy.visit(HOME_PATH);
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
