import { PERMISSION_LEVELS } from '../../src/config/constants';
import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_SHARE_BUTTON_CLASS,
  SHARE_ITEM_MODAL_PERMISSION_SELECT_ID,
  SHARE_ITEM_MODAL_SHARE_BUTTON_ID,
  buildPermissionOptionId,
  SHARE_ITEM_MODAL_EMAIL_INPUT_ID,
} from '../../src/config/selectors';
import { MEMBERS, SIMPLE_ITEMS } from '../fixtures/items';

const shareItem = ({ id, member, permission }) => {
  const menuSelector = `#${buildItemCard(id)} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_SHARE_BUTTON_CLASS}`).click();

  // select permission
  cy.get(`#${SHARE_ITEM_MODAL_PERMISSION_SELECT_ID}`).click();
  cy.get(`#${buildPermissionOptionId(permission)}`).click();

  // input mail
  cy.get(`#${SHARE_ITEM_MODAL_EMAIL_INPUT_ID}`).type(member.email);

  cy.get(`#${SHARE_ITEM_MODAL_SHARE_BUTTON_ID}`).click();
};

describe('Share Item', () => {
  it('share item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, members: Object.values(MEMBERS) });
    cy.visit('/');

    // share
    const { id } = SIMPLE_ITEMS[0];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.WRITE });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemCard(id)}`).should('exist');
    });
  });

  it('share item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    cy.visit(buildItemPath(SIMPLE_ITEMS[0].id));

    // share
    const { id } = SIMPLE_ITEMS[2];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.READ });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemCard(id)}`).should('exist');
    });
  });

  // todo : check item permission for users
});
