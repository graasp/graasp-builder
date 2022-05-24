import { buildItemPath } from '../../../src/config/paths';
import {
  buildInvitationTableRowSelector,
  buildItemInvitationRowDeleteButtonId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { ITEMS_WITH_INVITATIONS } from '../../fixtures/invitations';

describe('View Invitations', () => {
  beforeEach(() => {
    cy.setUpApi({ ...ITEMS_WITH_INVITATIONS });
  });

  it('view invitation in share item modal', () => {
    const item = ITEMS_WITH_INVITATIONS.items[1];
    const { invitations } = item;
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    invitations.forEach(({ itemPath, id, email }) => {
      cy.get(buildInvitationTableRowSelector(id)).should('contain', email);

      if (itemPath !== item.path) {
        cy.get(`#${buildItemInvitationRowDeleteButtonId(id)}`).should(
          'be.disabled',
        );
      }
    });

    // todo: check permission
  });
});
