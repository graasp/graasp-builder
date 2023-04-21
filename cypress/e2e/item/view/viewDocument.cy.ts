import { buildItemPath } from '../../../../src/config/paths';
import { GRAASP_DOCUMENT_ITEM } from '../../../fixtures/documents';
import { expectDocumentViewScreenLayout } from '../../../support/viewUtils';

describe('View Document', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [GRAASP_DOCUMENT_ITEM],
      });
    });

    it('visit document', () => {
      cy.visit(buildItemPath(GRAASP_DOCUMENT_ITEM.id));

      expectDocumentViewScreenLayout({ item: GRAASP_DOCUMENT_ITEM });
    });
  });
});
