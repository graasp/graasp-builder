import { ItemTagType } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  HIDDEN_ITEM_BUTTON_CLASS,
  buildHideButtonId,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import {
  CHILD_HIDDEN_ITEM,
  HIDDEN_ITEM,
  ITEMS_SETTINGS,
} from '../../../fixtures/items';

const toggleHideButton = (itemId: string, isHidden = false) => {
  const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
  cy.get(menuSelector).click();

  cy.get(`#${buildItemMenu(itemId)} .${HIDDEN_ITEM_BUTTON_CLASS}`)
    .should('have.attr', 'data-cy', buildHideButtonId(isHidden))
    .click();
};

describe('Hiding Item', () => {
  describe('Successfully hide item in List', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
    });

    it('Hide an item', () => {
      cy.visit(HOME_PATH);
      const item = ITEMS_SETTINGS.items[1];

      toggleHideButton(item.id, false);

      cy.wait(`@postItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(ItemTagType.Hidden);
          expect(url).to.contain(item.id);
        },
      );
    });

    it('Show an item', () => {
      cy.visit(HOME_PATH);
      const item = HIDDEN_ITEM;

      // make sure to wait for the tags to be fetched
      toggleHideButton(item.id, true);

      cy.wait(`@deleteItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(ItemTagType.Hidden);
          expect(url).to.contain(item.id);
        },
      );
    });

    it('Cannot hide child of hidden item', () => {
      cy.visit(buildItemPath(HIDDEN_ITEM.id));
      cy.get(`#${buildItemMenuButtonId(CHILD_HIDDEN_ITEM.id)}`).click();
      cy.get(
        `#${buildItemMenu(CHILD_HIDDEN_ITEM.id)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
      ).should(($menuItem) => {
        const classList = Array.from($menuItem[0].classList);
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        expect(classList.some((c) => c.includes('disabled'))).to.be.true;
      });
    });
  });

  describe('Successfully hide item in Grid', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
    });

    it('Hide an item', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);
      const item = ITEMS_SETTINGS.items[1];

      toggleHideButton(item.id, false);

      cy.wait(`@postItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(ItemTagType.Hidden);
          expect(url).to.contain(item.id);
        },
      );
    });

    it('Show an Item', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);
      const item = ITEMS_SETTINGS.items[0];

      toggleHideButton(item.id, true);

      cy.wait(`@deleteItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(item.id);
          expect(url).to.contain(ItemTagType.Hidden);
        },
      );
    });

    it('Cannot hide child of hidden item', () => {
      cy.visit(buildItemPath(HIDDEN_ITEM.id));
      cy.switchMode(ItemLayoutMode.Grid);

      cy.get(`#${buildItemMenuButtonId(CHILD_HIDDEN_ITEM.id)}`).click();
      cy.get(
        `#${buildItemMenu(CHILD_HIDDEN_ITEM.id)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
      ).should(($menuItem) => {
        const classList = Array.from($menuItem[0].classList);
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        expect(classList.some((c) => c.includes('disabled'))).to.be.true;
      });
    });
  });
});
