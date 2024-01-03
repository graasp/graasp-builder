import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  PIN_ITEM_BUTTON_CLASS,
  buildDownloadButtonId,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import {
  ITEMS_SETTINGS,
  PINNED_ITEM,
  PUBLISHED_ITEM,
} from '../../../fixtures/items';

const togglePinButton = (itemId: string) => {
  cy.get(`#${buildItemMenuButtonId(itemId)}`).click();
  cy.get(`#${buildItemMenu(itemId)} .${PIN_ITEM_BUTTON_CLASS}`).click();
};

describe('Anonymous', () => {
  const itemId = PUBLISHED_ITEM.id;
  beforeEach(() => {
    cy.setUpApi({ currentMember: null, items: [PUBLISHED_ITEM] });
    cy.visit(buildItemPath(itemId));
  });
  it("Can see item but can't pin", () => {
    cy.get(`#${buildDownloadButtonId(itemId)}`).should('be.visible');
    cy.get(`#${buildItemMenuButtonId(itemId)}`).should('not.exist');
  });
});

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
