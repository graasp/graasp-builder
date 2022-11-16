import { buildItemPath } from '../../../../src/config/paths';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '../../../../src/config/selectors';
import { SAMPLE_PUBLIC_ITEMS } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { expectFolderViewScreenLayout } from '../../../support/viewUtils';

describe('Public Items', () => {
  describe('Enabled', () => {
    it('Signed out user can access a public item', () => {
      const currentMember = SIGNED_OUT_MEMBER;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[4];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.wait('@getPublicChildren');
      expectFolderViewScreenLayout({ item, currentMember });
    });

    it('User without a membership can access a public item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[4];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.wait('@getPublicChildren');
      expectFolderViewScreenLayout({ item, currentMember });
    });

    it('User without a membership can access a child of a public item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[2];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.wait('@getPublicChildren');
      expectFolderViewScreenLayout({ item, currentMember });
    });
  });

  describe('Disabled', () => {
    it('Signed out user cannot access a private item', () => {
      const currentMember = SIGNED_OUT_MEMBER;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[1];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });

    it('User without a membership cannot access a private item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[1];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });

    it('User without a membership cannot access a child of a private item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[6];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });
  });
});
