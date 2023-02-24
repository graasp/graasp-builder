import { buildItemPath } from '../../../src/config/paths';
import {
  buildInvitationTableRowSelector,
  buildItemInvitationRowDeleteButtonId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import {
  ITEMS_WITH_INVITATIONS,
  ITEM_WITH_INVITATIONS_WRITE_ACCESS,
} from '../../fixtures/invitations';

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

describe('View Invitations Read-Only Mode', () => {
  beforeEach(() => {
    cy.setUpApi({ ...ITEM_WITH_INVITATIONS_WRITE_ACCESS });
  });

  it('view invitation in share item modal read-only mode', () => {
    const item = ITEM_WITH_INVITATIONS_WRITE_ACCESS.items[0];
    const { invitations } = item;
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    invitations.forEach(({ id, email, permission }) => {
      cy.get(buildInvitationTableRowSelector(id))
        .should('contain', email)
        .should('contain', permission);

      // delete invitation button should not exist
      cy.get(`#${buildItemInvitationRowDeleteButtonId(id)}`).should(
        'not.exist',
      );
    });

    // todo: check permission
  });
});
