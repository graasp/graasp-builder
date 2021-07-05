import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { FAVORITE_ITEMS_PATH, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemMenu,
  buildItemsTableRowId,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_FAVORITE_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { buildMemberWithFavorites } from '../../../fixtures/members';

const toggleFavoriteButton = (itemId) => {
  const menuSelector = `#${buildItemsTableRowId(
    itemId,
  )} .${ITEM_MENU_BUTTON_CLASS}`;

  cy.get(menuSelector).click();

  const favoriteButton = cy.get(
    `#${buildItemMenu(itemId)} .${ITEM_MENU_FAVORITE_BUTTON_CLASS}`,
  );

  favoriteButton.click();
};

describe('Favorite Item', () => {
  beforeEach(() => {
    cy.setUpApi({
      ...SAMPLE_ITEMS,
      currentMember: buildMemberWithFavorites([SAMPLE_ITEMS.items[1].id]),
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
    const item = SAMPLE_ITEMS.items[1];

    toggleFavoriteButton(item.id);

    cy.wait('@editMember').then(
      ({
        request: {
          body: { extra },
        },
      }) => {
        expect(!extra.favoriteItems.includes(item.id));
      },
    );
  });

  it('check favorite items view', () => {
    cy.visit(FAVORITE_ITEMS_PATH);

    const item = SAMPLE_ITEMS.items[1];

    cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
  });
});
