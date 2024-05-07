import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  PIN_ITEM_BUTTON_CLASS,
  buildDownloadButtonId,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const togglePinButton = (itemId: string) => {
  // todo: remove on table refactor
  cy.wait(500);
  cy.get(`#${buildItemMenuButtonId(itemId)}`).click();
  cy.get(`#${buildItemMenu(itemId)} .${PIN_ITEM_BUTTON_CLASS}`).click();
};

const PINNED_ITEM = PackedFolderItemFactory({ settings: { isPinned: true } });
const ITEM = PackedFolderItemFactory({ settings: { isPinned: false } });

describe('Anonymous', () => {
  const itemId = ITEM.id;
  beforeEach(() => {
    cy.setUpApi({ currentMember: null, items: [ITEM] });
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
      cy.setUpApi({ items: [PINNED_ITEM, ITEM] });
      cy.visit(HOME_PATH);
    });

    it('Pin an item', () => {
      const item = ITEM;

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
      cy.setUpApi({ items: [PINNED_ITEM, ITEM] });
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);
    });

    it('Pin an item', () => {
      const item = ITEM;

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
