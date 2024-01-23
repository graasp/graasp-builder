import { buildItemSettingsPath } from '@/config/paths';
import { CLEAR_CHAT_SETTING_ID } from '@/config/selectors';

import { ITEMS_WITH_MEMBERSHIPS } from '../../../fixtures/memberships';

describe('Check settings page work properly', () => {
  beforeEach(() => {
    cy.setUpApi({
      ...ITEMS_WITH_MEMBERSHIPS,
    });
  });
  const itemId = ITEMS_WITH_MEMBERSHIPS.items[0].id;
  it('Check that chat button exist', () => {
    cy.visit(buildItemSettingsPath(itemId));
    cy.get(`#${CLEAR_CHAT_SETTING_ID}`).should('exist').and('be.visible');
  });
});
