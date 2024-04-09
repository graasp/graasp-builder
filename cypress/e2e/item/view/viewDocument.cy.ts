import { PackedDocumentItemFactory } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import { CURRENT_USER } from '../../../fixtures/members';
import { buildItemMembership } from '../../../fixtures/memberships';
import { expectDocumentViewScreenLayout } from '../../../support/viewUtils';

const DOCUMENT = PackedDocumentItemFactory();

describe('View Document', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          {
            ...DOCUMENT,
            memberships: [
              buildItemMembership({
                item: DOCUMENT,
                member: CURRENT_USER,
              }),
            ],
          },
        ],
      });
    });

    it('visit document', () => {
      cy.visit(buildItemPath(DOCUMENT.id));

      expectDocumentViewScreenLayout({ item: DOCUMENT });
    });
  });
});
