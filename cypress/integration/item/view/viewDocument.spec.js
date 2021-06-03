import { buildItemPath } from '../../../../src/config/paths';
import { GRAASP_DOCUMENT_ITEM } from '../../../fixtures/documents';
import { expectDocumentViewScreenLayout } from './utils';

describe('View Space', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [GRAASP_DOCUMENT_ITEM],
      });
    });

    it('visit document', () => {
      cy.visit(buildItemPath(GRAASP_DOCUMENT_ITEM.id));

      expectDocumentViewScreenLayout(GRAASP_DOCUMENT_ITEM);
    });
  });
});
