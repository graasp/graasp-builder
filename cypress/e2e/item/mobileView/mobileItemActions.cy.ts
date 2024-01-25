import { buildItemPath } from '../../../../src/config/paths';
import {
  COLLAPSE_ITEM_BUTTON_CLASS,
  EDIT_ITEM_BUTTON_CLASS,
  FAVORITE_ITEM_BUTTON_CLASS,
  HIDDEN_ITEM_BUTTON_CLASS,
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  ITEM_SETTINGS_BUTTON_CLASS,
  MOBILE_MORE_ACTIONS_BUTTON_ID,
  MODE_GRID_BUTTON_ID,
  PIN_ITEM_BUTTON_CLASS,
  PUBLISH_ITEM_BUTTON_CLASS,
  SHARE_ITEM_BUTTON_CLASS,
  buildDownloadButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const visitItem = ({ id }: { id: string }) => {
  cy.visit(buildItemPath(id));
  cy.switchMode(ITEM_LAYOUT_MODES.LIST);
};

const buttons = [
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_CHATBOX_BUTTON_ID,
  MODE_GRID_BUTTON_ID,
];

const drawerButtonsSelectors = [
  ITEM_MENU_COPY_BUTTON_CLASS,
  FAVORITE_ITEM_BUTTON_CLASS,
  SHARE_ITEM_BUTTON_CLASS,
  PUBLISH_ITEM_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  HIDDEN_ITEM_BUTTON_CLASS,
  COLLAPSE_ITEM_BUTTON_CLASS,
  PIN_ITEM_BUTTON_CLASS,
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_SETTINGS_BUTTON_CLASS,
  EDIT_ITEM_BUTTON_CLASS,
];
describe('check item actions within mobile view', () => {
  beforeEach(() => {
    // run these tests as if in a mobile
    cy.viewport(400, 750);
  });
  it('check view, chat, and info buttons exits', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);

    visitItem({ id });
    buttons.forEach((btn) => {
      cy.get(`#${btn}`).should('exist');
    });
  });

  drawerButtonsSelectors.forEach((btn) => {
    it(`check drawer ${btn}  exist`, () => {
      const { id } = SAMPLE_ITEMS.items[1];
      cy.setUpApi(SAMPLE_ITEMS);

      visitItem({ id });

      cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
      cy.get(`.${btn}`).should('exist');
    });
    it('check download button exist', () => {
      const { id } = SAMPLE_ITEMS.items[1];
      cy.setUpApi(SAMPLE_ITEMS);

      visitItem({ id });

      cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
      cy.get(`#${buildDownloadButtonId(id)}`).should('exist');
    });
  });
});
