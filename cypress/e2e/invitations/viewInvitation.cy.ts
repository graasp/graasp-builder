import { PackedFolderItemFactory, PermissionLevel } from '@graasp/sdk';
import { namespaces } from '@graasp/translations';

import i18n from '@/config/i18n';

import { buildItemPath, buildItemSharePath } from '../../../src/config/paths';
import {
  ITEM_RESEND_INVITATION_BUTTON_CLASS,
  buildInvitationTableRowId,
  buildItemInvitationRowDeleteButtonId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { ITEMS_WITH_INVITATIONS } from '../../fixtures/invitations';
import { CURRENT_USER, MEMBERS } from '../../fixtures/members';

describe('View Invitations', () => {
  beforeEach(() => {
    cy.setUpApi(ITEMS_WITH_INVITATIONS);
  });

  it('view invitation in share item modal', () => {
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    const item = ITEMS_WITH_INVITATIONS.items[1];
    const { invitations } = item;
    cy.visit(buildItemSharePath(item.id));

    invitations.forEach(
      ({ item: { path: itemPath }, id, email, permission }) => {
        if (itemPath !== item.path) {
          cy.get(`#${buildItemInvitationRowDeleteButtonId(id)}`).should(
            'be.disabled',
          );
        }
        cy.get(`#${buildInvitationTableRowId(id)}`)
          .should('contain', email)
          .should('contain', i18n.t(permission, { ns: namespaces.enums }));

        cy.get(
          `#${buildInvitationTableRowId(id)} .${ITEM_RESEND_INVITATION_BUTTON_CLASS}`,
        ).should('exist');
      },
    );
  });
});

describe('Cannot view Invitations for writers and readers', () => {
  it('view invitation in share item modal write-only mode', () => {
    const item = PackedFolderItemFactory(
      {},
      { permission: PermissionLevel.Write },
    );
    const invitations = [
      {
        id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
        item,
        permission: PermissionLevel.Write,
        email: MEMBERS.CEDRIC.email,
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
      {
        id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
        item,
        permission: PermissionLevel.Read,
        email: MEMBERS.DAVID.email,
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ];
    cy.setUpApi({ items: [{ ...item, invitations }] });

    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    // should not contain given invitations
    cy.get('tr').then((c) => {
      invitations.forEach((inv) => {
        expect(c[0]).not.to.contain(inv.email);
      });
    });
  });
});
