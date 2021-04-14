import {
  ITEM_LAYOUT_MODES,
  PERMISSION_LEVELS,
  DEFAULT_ITEM_LAYOUT_MODE,
} from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  SHARE_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { MEMBERS } from '../../../fixtures/members';

const shareItem = ({ id, member, permission }) => {
  cy.get(`#${buildItemsTableRowId(id)} .${SHARE_ITEM_BUTTON_CLASS}`).click();

  cy.fillShareModal({ member, permission });
};

describe('Share Item in List', () => {
  it('share item on Home', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS, members: Object.values(MEMBERS) });
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // share
    const { id } = SAMPLE_ITEMS[0];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.WRITE });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
    });
  });

  it('share item in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    cy.visit(buildItemPath(SAMPLE_ITEMS[0].id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // share
    const { id } = SAMPLE_ITEMS[2];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.READ });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
    });
  });

  // todo : check item permission for users
});
