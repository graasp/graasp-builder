import {
  HIDDEN_ITEM,
  ITEMS_SETTINGS,
  CHILD_HIDDEN_ITEM,
} from '../../../fixtures/items';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemMenu,
  buildItemMenuButtonId,
  HIDDEN_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';

const toggleHideButton = (itemId) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(itemId)} .${HIDDEN_ITEM_BUTTON_CLASS}`).click();
};

const HIDDEN_ITEM_TAG_ID = Cypress.env('HIDDEN_ITEM_TAG_ID');

describe('Hiding Item', () => {
  describe('Successfully hide item in List', () => {
    beforeEach(() => {
      cy.setUpApi(ITEMS_SETTINGS);
    });

    it('Hide an item', () => {
      cy.visit(HOME_PATH);
      const item = ITEMS_SETTINGS.items[1];

      toggleHideButton(item.id);

      cy.wait(`@postItemTag`).then(
        ({
          request: {
            body: { tagId },
          },
        }) => {
          expect(tagId).to.equals(HIDDEN_ITEM_TAG_ID);
        },
      );
    });

    it('Show an item', () => {
      cy.visit(HOME_PATH);
      const item = HIDDEN_ITEM;

      cy.wait(5000);
      toggleHideButton(item.id);

      cy.wait('@deleteItemTag').then(({ request: { url } }) => {
        expect(url).to.contain(item.tags[1].id);
      });
    });

    it('Cannot hide child of hidden item', () => {
      cy.visit(buildItemPath(HIDDEN_ITEM.id));
      cy.wait(TABLE_ITEM_RENDER_TIME);
      cy.get(`#${buildItemMenuButtonId(CHILD_HIDDEN_ITEM.id)}`).click();
      cy.get(
        `#${buildItemMenu(CHILD_HIDDEN_ITEM.id)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
      ).should(($menuItem) => {
        const classList = Array.from($menuItem[0].classList);
        // eslint-disable-next-line no-unused-expressions
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
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);
      const item = ITEMS_SETTINGS.items[1];

      toggleHideButton(item.id);

      cy.wait(`@postItemTag`).then(
        ({
          request: {
            body: { tagId },
          },
        }) => {
          expect(tagId).to.equals(HIDDEN_ITEM_TAG_ID);
        },
      );
    });

    it('Show an Item', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);
      const item = ITEMS_SETTINGS.items[0];

      toggleHideButton(item.id);

      cy.wait('@deleteItemTag').then(({ request: { url } }) => {
        expect(url).to.contain(item.tags[1].id);
      });
    });

    it('Cannot hide child of hidden item', () => {
      cy.visit(buildItemPath(HIDDEN_ITEM.id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      cy.wait(TABLE_ITEM_RENDER_TIME);
      cy.get(`#${buildItemMenuButtonId(CHILD_HIDDEN_ITEM.id)}`).click();
      cy.get(
        `#${buildItemMenu(CHILD_HIDDEN_ITEM.id)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
      ).should(($menuItem) => {
        const classList = Array.from($menuItem[0].classList);
        // eslint-disable-next-line no-unused-expressions
        expect(classList.some((c) => c.includes('disabled'))).to.be.true;
      });
    });
  });
});
