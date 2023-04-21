import { FlagType } from '@graasp/sdk';

import { HOME_PATH } from '../../../../src/config/paths';
import {
  FLAG_ITEM_BUTTON_ID,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  buildFlagListItemId,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
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

const flagItem = (itemId, type) => {
  openFlagItemModal(itemId);

  const flagListItem = cy.get(`#${buildFlagListItemId(type)}`);

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
    const type = FlagType.FALSE_INFORMATION;

    flagItem(item.id, type);

    cy.wait('@postItemFlag').then(
      ({
        request: {
          url,
          body: { type: flagType },
        },
      }) => {
        expect(flagType).to.equal(type);
        expect(url).to.contain(item.id);
      },
    );
  });
});
