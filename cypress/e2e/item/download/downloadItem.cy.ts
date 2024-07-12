import { PackedFolderItemFactory, PermissionLevel } from '@graasp/sdk';

import { buildDownloadButtonId } from '@/config/selectors';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { SAMPLE_PUBLIC_ITEMS } from '../../../fixtures/items';
import { SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const SHARED_ITEM = PackedFolderItemFactory(
  {},
  { permission: PermissionLevel.Read },
);

describe('Download Item', () => {
  it('Table View', () => {
    cy.setUpApi({ items: [SHARED_ITEM] });
    cy.visit(HOME_PATH);
    cy.wait('@getAccessibleItems').then(
      ({
        response: {
          body: { data },
        },
      }) => {
        for (const item of data) {
          cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
        }
      },
    );
  });
  it('Grid view', () => {
    cy.setUpApi({ items: [SHARED_ITEM] });
    cy.visit(HOME_PATH);
    cy.wait('@getAccessibleItems').then(
      ({
        response: {
          body: { data },
        },
      }) => {
        for (const item of data) {
          cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
        }
      },
    );
  });
  it('download button for public item should be exist', () => {
    const currentMember = SIGNED_OUT_MEMBER;
    cy.setUpApi({
      ...SAMPLE_PUBLIC_ITEMS,
      currentMember,
    });
    const item = SAMPLE_PUBLIC_ITEMS.items[4];
    cy.visit(buildItemPath(item.id));
    cy.wait('@getItem').then(({ response: { body } }) => {
      expect(body.id).to.equal(item.id);
      cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
    });
  });
});
