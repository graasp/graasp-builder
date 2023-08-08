import { FlagType } from '@graasp/sdk';
import { namespaces } from '@graasp/translations';

import i18n from '../../../../src/config/i18n';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  ITEM_MENU_FLAG_BUTTON_CLASS,
  buildFlagListItemId,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { CURRENT_USER } from '../../../fixtures/members';

const openFlagItemModal = (itemId: string) => {
  const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
  cy.get(menuSelector).click();

  const menuFlagButton = cy.get(
    `#${buildItemMenu(itemId)} .${ITEM_MENU_FLAG_BUTTON_CLASS}`,
  );

  menuFlagButton.click();
};

const flagItem = (itemId: string, type: FlagType) => {
  openFlagItemModal(itemId);

  const flagListItem = cy.get(`#${buildFlagListItemId(type)}`);

  flagListItem.click();

  i18n.changeLanguage(CURRENT_USER.extra.lang as string);
  const text = i18n.t('Flag', { ns: namespaces.builder });
  const flagItemButton = cy.get(`button:contains("${text}")`);

  flagItemButton.click();
};

describe('Flag Item', () => {
  beforeEach(() => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
  });

  it('flag item', () => {
    const item = SAMPLE_ITEMS.items[0];
    const type = FlagType.FalseInformation;

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
