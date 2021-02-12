import {
  MODES,
  PERMISSION_LEVELS,
  DEFAULT_MODE,
} from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  SHARE_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { MEMBERS, SIMPLE_ITEMS } from '../../../fixtures/items';

const shareItem = ({ id, member, permission }) => {
  cy.get(`#${buildItemsTableRowId(id)} .${SHARE_ITEM_BUTTON_CLASS}`).click();

  cy.fillShareModal({ member, permission });
};

describe('Share Item in List', () => {
  it('share item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, members: Object.values(MEMBERS) });
    cy.visit(HOME_PATH);

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // share
    const { id } = SIMPLE_ITEMS[0];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.WRITE });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
    });
  });

  it('share item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    cy.visit(buildItemPath(SIMPLE_ITEMS[0].id));

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // share
    const { id } = SIMPLE_ITEMS[2];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.READ });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
    });
  });

  // todo : check item permission for users
});
