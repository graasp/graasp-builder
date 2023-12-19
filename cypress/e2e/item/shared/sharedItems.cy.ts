import i18n, { BUILDER_NAMESPACE } from '@/config/i18n';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  NAVIGATION_ROOT_ID,
  buildItemCard,
  buildItemMenu,
  buildItemMenuButtonId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { SHARED_ITEMS_PATH } from '../../../../src/config/paths';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { MEMBERS } from '../../../fixtures/members';

const translateBuilder = (key: string) =>
  i18n.t(key, { ns: BUILDER_NAMESPACE });

describe('Shared Items', () => {
  beforeEach(() => {
    cy.setUpApi({ ...SAMPLE_ITEMS, currentMember: MEMBERS.BOB });
    cy.visit(SHARED_ITEMS_PATH);
    cy.wait(5000);
  });
  describe('Grid', () => {
    it('visit Shared Items', () => {
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      cy.wait('@getSharedItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // visit child
      const { id: childId } = SAMPLE_ITEMS.items[1];
      cy.goToItemInGrid(childId);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });

      // breadcrumb navigation
      cy.get(`#${NAVIGATION_ROOT_ID}`).contains(
        translateBuilder(BUILDER.NAVIGATION_SHARED_ITEMS_TITLE),
      );
    });
    it('move should be prevented', () => {
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);
      const itemId = SAMPLE_ITEMS.items[1].id;
      const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
      cy.get(menuSelector).click();
      cy.get(
        `#${buildItemMenu(itemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
      ).should('not.exist');
    });
  });

  it('move should be prevented in list', () => {
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    const itemId = SAMPLE_ITEMS.items[1].id;
    const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
    cy.get(menuSelector).click();
    cy.get(`#${buildItemMenu(itemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`).should(
      'not.exist',
    );
  });
});
