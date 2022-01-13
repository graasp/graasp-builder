import { ITEMS_SETTINGS, PINNED_ITEM } from '../../../fixtures/items';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemsTableRowIdAttribute,
  PIN_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';

const togglePinButton = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(
    `${buildItemsTableRowIdAttribute(itemId)} .${PIN_ITEM_BUTTON_CLASS}`,
  ).click();
};

const togglePinButtonCard = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(`#${buildItemCard(itemId)} .${PIN_ITEM_BUTTON_CLASS}`).click();
};

describe('Pinning Item', () => {
  describe('Successfully pinning item in List', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
      cy.visit(HOME_PATH);
    });

    it('Pin an item', () => {
      const item = ITEMS_SETTINGS.items[0];

      togglePinButton(item.id);

      cy.wait(`@editItem`).then(
        ({
          request: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).to.equals(true);
        },
      );
    });

    it('Unpin Item', () => {
      const item = PINNED_ITEM;

      togglePinButton(item.id);

      cy.wait('@editItem').then(
        ({
          request: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).to.equals(false);
        },
      );
    });
  });

  describe('Successfully pinning item in Grid', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    });

    it('Pin an item', () => {
      const item = ITEMS_SETTINGS.items[0];

      togglePinButtonCard(item.id);

      cy.wait(`@editItem`).then(
        ({
          request: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).to.equals(true);
        },
      );
    });

    it('Unpin Item', () => {
      const item = PINNED_ITEM;

      togglePinButtonCard(item.id);

      cy.wait('@editItem').then(
        ({
          request: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).to.equals(false);
        },
      );
    });
  });
});
