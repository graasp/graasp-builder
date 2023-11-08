import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '@/config/selectors';

import { SHARED_ITEMS_PATH } from '../../../../src/config/paths';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { MEMBERS } from '../../../fixtures/members';

describe('Shared Items', () => {
  beforeEach(() => {
    cy.setUpApi({ ...SAMPLE_ITEMS, currentMember: MEMBERS.BOB });
    cy.visit(SHARED_ITEMS_PATH);
    cy.wait(5000);
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
  it('move should be prevented in grid', () => {
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    const itemId = SAMPLE_ITEMS.items[1].id;
    const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
    cy.get(menuSelector).click();
    cy.get(`#${buildItemMenu(itemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`).should(
      'not.exist',
    );
  });
});
