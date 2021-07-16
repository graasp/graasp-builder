import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  buildFlagListItemId,
  buildItemMenu,
  buildItemMenuButtonId,
  FLAG_ITEM_BUTTON_ID,
  ITEM_MENU_FLAG_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_FLAGS } from '../../../fixtures/flags';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const openFlagItemModal = (itemId) => {
  const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(menuSelector).click();

  const menuFlagButton = cy.get(
    `#${buildItemMenu(itemId)} .${ITEM_MENU_FLAG_BUTTON_CLASS}`,
  );

  menuFlagButton.click();
};

const flagItem = (itemId, flagId) => {
  openFlagItemModal(itemId);

  const flagListItem = cy.get(`#${buildFlagListItemId(flagId)}`);

  flagListItem.click();

  const flagItemButton = cy.get(`#${FLAG_ITEM_BUTTON_ID}`);

  flagItemButton.click();
};

describe('Flag Item', () => {
  beforeEach(() => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
  });

  it('flag item', () => {
    const item = SAMPLE_ITEMS.items[0];
    const flag = SAMPLE_FLAGS[0];

    flagItem(item.id, flag.id);

    cy.wait('@postItemFlag').then(
      ({
        request: {
          url,
          body: { flagId },
        },
      }) => {
        expect(flagId).to.equal(flag.id);
        expect(url).to.contain(item.id);
      },
    );
  });
});
