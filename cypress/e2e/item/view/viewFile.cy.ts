import { HOME_PATH } from '../../../../src/config/paths';
import { buildItemsTableRowIdAttribute } from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import {
  IMAGE_ITEM_DEFAULT,
  IMAGE_ITEM_S3,
  PDF_ITEM_DEFAULT,
  PDF_ITEM_S3,
  VIDEO_ITEM_DEFAULT,
  VIDEO_ITEM_S3,
} from '../../../fixtures/files';
import { expectFileViewScreenLayout } from '../../../support/viewUtils';

describe('View Files', () => {
  describe('default server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_DEFAULT, PDF_ITEM_DEFAULT],
      });
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    });
    it('image', () => {
      // item is displayed in table
      cy.get(buildItemsTableRowIdAttribute(IMAGE_ITEM_DEFAULT.id)).should(
        'exist',
      );

      // item metadata
      cy.goToItemInList(IMAGE_ITEM_DEFAULT.id);
      expectFileViewScreenLayout({ item: IMAGE_ITEM_DEFAULT });
    });

    it('video', () => {
      // item is displayed in table
      cy.get(buildItemsTableRowIdAttribute(VIDEO_ITEM_DEFAULT.id)).should(
        'exist',
      );

      // item metadata
      cy.goToItemInList(VIDEO_ITEM_DEFAULT.id);
      expectFileViewScreenLayout({ item: VIDEO_ITEM_DEFAULT });
    });

    it('pdf', () => {
      // item is displayed in table
      cy.get(buildItemsTableRowIdAttribute(PDF_ITEM_DEFAULT.id)).should(
        'exist',
      );

      // item metadata
      cy.goToItemInList(PDF_ITEM_DEFAULT.id);
      expectFileViewScreenLayout({ item: PDF_ITEM_DEFAULT });
    });
  });

  describe('s3 server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_S3, VIDEO_ITEM_S3, PDF_ITEM_S3],
      });
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    });
    it('image', () => {
      // item is displayed in table
      cy.get(buildItemsTableRowIdAttribute(IMAGE_ITEM_S3.id)).should('exist');

      // item metadata
      cy.goToItemInList(IMAGE_ITEM_S3.id);
      expectFileViewScreenLayout({ item: IMAGE_ITEM_S3 });
    });

    it('video', () => {
      // item is displayed in table
      cy.get(buildItemsTableRowIdAttribute(VIDEO_ITEM_S3.id)).should('exist');

      // item metadata
      cy.goToItemInList(VIDEO_ITEM_S3.id);
      expectFileViewScreenLayout({ item: VIDEO_ITEM_S3 });
    });

    it('pdf', () => {
      // item is displayed in table
      cy.get(buildItemsTableRowIdAttribute(PDF_ITEM_S3.id)).should('exist');

      // item metadata
      cy.goToItemInList(PDF_ITEM_S3.id);
      expectFileViewScreenLayout({ item: PDF_ITEM_S3 });
    });
  });
});
