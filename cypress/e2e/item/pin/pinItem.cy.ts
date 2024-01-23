import { HOME_PATH } from '../../../../src/config/paths';
import {
  PIN_ITEM_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { ITEMS_SETTINGS, PINNED_ITEM } from '../../../fixtures/items';
import { WAIT_FOR_ITEM_TABLE_ROW_TIME } from '../../../support/constants';

const togglePinButton = (itemId: string) => {
  cy.wait(WAIT_FOR_ITEM_TABLE_ROW_TIME);
  cy.get(`#${buildItemMenuButtonId(itemId)}`).click();
  cy.get(`#${buildItemMenu(itemId)} .${PIN_ITEM_BUTTON_CLASS}`).click();
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
});
