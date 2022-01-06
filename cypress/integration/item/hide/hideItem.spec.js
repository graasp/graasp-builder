import { HIDDEN_ITEM, ITEMS_SETTINGS } from '../../../fixtures/items';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemsTableRowIdAttribute,
  HIDDEN_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';

const HiddenTagId = 'hiddenTagId';

const toggleHideButton = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(
    `${buildItemsTableRowIdAttribute(itemId)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
  ).click();
};

const toggleHideButtonCard = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(`#${buildItemCard(itemId)} .${HIDDEN_ITEM_BUTTON_CLASS}`).click();
};

describe('Hiding Item', () => {
  describe('Successfully hide item in List', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
      cy.visit(HOME_PATH);
    });

    it('Hide an item', () => {
      const item = ITEMS_SETTINGS.items[1];

      toggleHideButton(item.id);

      cy.wait(`@postItemTag`).then(
        ({
          request: {
            body: { tagId },
          },
        }) => {
          expect(tagId).to.equals(HiddenTagId);
        },
      );
    });

    it('Show an item', () => {
      const item = HIDDEN_ITEM;

      cy.wait(5000);
      toggleHideButton(item.id);

      cy.wait('@deleteItemTag').then(({ request: { url } }) => {
        expect(url).to.contain(item.tags[1].id);
      });
    });
  });

  describe('Successfully hide item in Grid', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    });

    it('Hide an item', () => {
      const item = ITEMS_SETTINGS.items[1];

      toggleHideButtonCard(item.id);

      cy.wait(`@postItemTag`).then(
        ({
          request: {
            body: { tagId },
          },
        }) => {
          expect(tagId).to.equals(HiddenTagId);
        },
      );
    });

    it('Show an Item', () => {
      const item = ITEMS_SETTINGS.items[0];

      toggleHideButtonCard(item.id);

      cy.wait('@deleteItemTag').then(({ request: { url } }) => {
        expect(url).to.contain(item.tags[1].id);
      });
    });
  });
});
